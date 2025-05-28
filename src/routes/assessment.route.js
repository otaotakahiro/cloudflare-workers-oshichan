import { AnimalEntity } from '../domains/animal.entity';
// import { ManeqlService } from '../infrastructures/sites/maneql.service';
import { AngrytellerService } from '../infrastructures/sites/angryteller.service';
import { AstrolineService } from '../infrastructures/sites/astroline.service';
import { AskOracleService } from '../infrastructures/sites/ask-oracle.service';
// import OpenaiService from '../infrastructures/ai/openai.service'; // ← 不要になるのでコメントアウトまたは削除
import { AoiService } from '../infrastructures/sites/aoi/aoi.service';
import { generateDiagnosis } from '../services/diagnosis.service.js'; // ← 新しいサービス関数をインポート
import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
// import { kv } from '@vercel/kv'; // Vercel KV ← 削除
import { saveDiagnosisResult, getDiagnosisResult } from '../services/kv.service.js';
// BASE_DIAGNOSIS_SYSTEM_PROMPT と generateBaseDiagnosisUserPrompt のインポートを削除
// import { BASE_DIAGNOSIS_SYSTEM_PROMPT, generateBaseDiagnosisUserPrompt } from '../prompts/base-diagnosis.prompt.js';
// diagnósticoPromptSchema のインポートは一旦コメントアウト (後で解決策を探す)
// import { diagnósticoPromptSchema } from '../prompts/diagnosis.prompt.schema.js';

const diagnosisRouter = new Hono();

/**
 * @param {Hono} app
 * @returns {Hono}
 */
export default function (app) {
  // 結果を作成
  app.post('/', async context => {
    console.log('診断リクエストを受け付けました。');
    try {
      const requestBody = await context.req.json();
      console.log('リクエストボディ:', JSON.stringify(requestBody, null, 2));

      const { birthdate, familyName, firstName, gender } = requestBody;
      const birthDateObj = new Date(birthdate);

      let animalData = null;
      try {
        const animalNumber = AnimalEntity.getAnimalNumber(birthDateObj);
        animalData = AnimalEntity.getAnimal(animalNumber);
        console.log('動物占い情報取得成功:', animalData);
      } catch (e) {
        console.error('動物占い情報の取得に失敗しました:', e);
        animalData = { error: '動物占い情報の取得に失敗しました' };
      }

      const externalSitePromises = [];
      if (familyName && firstName) {
        externalSitePromises.push(
          new AngrytellerService(familyName, firstName).getContent().catch(e => {
            console.error('AngrytellerServiceからの情報取得に失敗:', e);
            return { error: 'AngrytellerServiceからの情報取得に失敗' };
          })
        );
      }
      externalSitePromises.push(
        new AstrolineService(birthDateObj).getContent().catch(e => {
          console.error('AstrolineServiceからの情報取得に失敗:', e);
          return { error: 'AstrolineServiceからの情報取得に失敗' };
        })
      );
      externalSitePromises.push(
        new AskOracleService(birthDateObj).getContent().catch(e => {
          console.error('AskOracleServiceからの情報取得に失敗:', e);
          return { error: 'AskOracleServiceからの情報取得に失敗' };
        })
      );

      const resolvedSiteContents = await Promise.all(externalSitePromises);

      const externalSiteContents = {
        animalFortune: animalData,
        angrytellerContent: resolvedSiteContents[0] || { error: 'データなし' },
        astrolineContent: resolvedSiteContents[1] || { error: 'データなし' },
        askOracleContent: resolvedSiteContents[2] || { error: 'データなし' },
        aoiContent: { error: '未取得 (動物キャラクター依存)' } // 初期値
      };

      // AoiService の処理 (animalData と animalData.character が正常に取得できた場合)
      if (animalData && animalData.character && gender) {
          try {
              const aoiService = new AoiService(animalData.character, gender);
              externalSiteContents.aoiContent = await aoiService.getContent().catch(e => {
                  console.error('AoiServiceからの情報取得に失敗:', e);
                  return { error: `AoiServiceからの情報取得に失敗: ${e.message}` };
              });
              console.log('AoiService情報取得成功:', externalSiteContents.aoiContent);
          } catch (e) {
              console.error('AoiServiceの処理に失敗:', e);
              externalSiteContents.aoiContent = { error: `AoiServiceの処理に失敗: ${e.message}` };
          }
      } else if (!animalData || !animalData.character) {
        externalSiteContents.aoiContent = { error: 'AoiService: 動物キャラクター不明のためスキップ' };
      } else if (!gender) {
        externalSiteContents.aoiContent = { error: 'AoiService: 性別不明のためスキップ' };
      }

      console.log('外部サイトコンテンツ:', JSON.stringify(externalSiteContents, null, 2));

      // userPrompt の生成は diagnosis.service.js 内で行うため、ここでは不要
      // const userPrompt = generateBaseDiagnosisUserPrompt(requestBody, externalSiteContents);

      const diagnosisResult = await generateDiagnosis(
        // BASE_DIAGNOSIS_SYSTEM_PROMPT, // 削除
        // userPrompt, // 削除
        requestBody, // formData として渡す
        // null, // schema は元々未使用のため削除
        context.env
      );
      console.log('診断結果生成完了');

      // エラーチェックの修正: diagnosisResult.base.error ではなく、
      // diagnosisResult.error や diagnosisResult.personalityFortuneError を確認する
      if (diagnosisResult.error || diagnosisResult.personalityFortuneError) {
        const errorMessage = diagnosisResult.error || diagnosisResult.personalityFortuneError || '診断結果の生成に失敗しました。';
        console.error(errorMessage, diagnosisResult);
        return context.json({ error: '診断結果の生成に失敗しました', details: errorMessage }, 500);
      }

      // 診断成功時のレスポンス構造も diagnosis.service.js 側で resultId を含めて返すようになったため、
      // ここでの dataToSave の再構築と saveDiagnosisResult の呼び出しは不要になる可能性がある。
      // diagnosis.service.js の戻り値をそのまま利用する。
      // ただし、KV保存が失敗した場合のエラーハンドリングは diagnosis.service.js 側で行われるようになったため、
      // ここでは diagnosisResult.id の有無で成功を判断し、エラー時はその内容を返す。

      if (!diagnosisResult.resultId) {
        // diagnosis.service.js 側でエラーがあれば、resultId は付与されない想定
        const errorMessage = diagnosisResult.error || diagnosisResult.personalityFortuneError || diagnosisResult.kvError || '診断処理中に不明なエラーが発生しました。';
        console.error('診断処理失敗 (resultIdなし):', errorMessage, diagnosisResult);
        return context.json({ error: '診断結果の保存または取得に失敗しました', details: errorMessage }, 500);
      }

      console.log('診断結果保存完了。Result ID:', diagnosisResult.resultId);

      // diagnosis.service.js から返される結果をそのままクライアントに返す
      return context.json(diagnosisResult);

    } catch (error) {
      console.error('診断リクエスト処理中にエラーが発生しました:', error);
      return context.json({ error: '診断リクエストの処理中に内部エラーが発生しました', details: error.message }, 500);
    }
  });

  // 結果を取得
  app.get('/:id', async context => {
    const id = context.req.param('id');
    const result = await getDiagnosisResult(context, id);

    if (!result) {
      return context.json(
        {
          error: 'Result not found',
        },
        404,
      );
    }

    return context.json({
      id,
      result: result,
    });
  });

  return app;
}
