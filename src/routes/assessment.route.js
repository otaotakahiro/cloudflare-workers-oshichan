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
import { BASE_DIAGNOSIS_SYSTEM_PROMPT, generateBaseDiagnosisUserPrompt } from '../prompts/base-diagnosis.prompt.js';
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

      const userPrompt = generateBaseDiagnosisUserPrompt(requestBody, externalSiteContents);

      const diagnosisResult = await generateDiagnosis(
        BASE_DIAGNOSIS_SYSTEM_PROMPT,
        userPrompt,
        requestBody,
        null,
        context.env
      );
      console.log('診断結果生成完了');

      if (!diagnosisResult || !diagnosisResult.base || diagnosisResult.base.error) {
        const errorMessage = diagnosisResult && diagnosisResult.base && diagnosisResult.base.error
          ? diagnosisResult.base.error
          : '診断結果の形式が無効か、ベース診断に失敗しました。';
        console.error(errorMessage, diagnosisResult);
        return context.json({ error: '診断結果の生成に失敗しました', details: errorMessage }, 500);
      }

      const dataToSave = {
        formData: requestBody,
        diagnosis: diagnosisResult
      };

      const resultId = await saveDiagnosisResult(context, dataToSave);
      console.log('診断結果保存完了。Result ID:', resultId);

      return context.json({ id: resultId, result: dataToSave });

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
