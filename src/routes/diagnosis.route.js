import { AnimalEntity } from '../domains/animal.entity';
// import { ManeqlService } from '../infrastructures/sites/maneql.service';
import { AngrytellerService } from '../infrastructures/sites/angryteller.service';
import { AstrolineService } from '../infrastructures/sites/astroline.service';
import { AskOracleService } from '../infrastructures/sites/ask-oracle.service';
// import OpenaiService from '../infrastructures/ai/openai.service'; // ← 不要になるのでコメントアウトまたは削除
import { AoiService } from '../infrastructures/sites/aoi/aoi.service';
import { generateDiagnosis } from '../services/diagnosis.service.js'; // ← 新しいサービス関数をインポート

/**
 * @param {Hono} app
 * @returns {Hono}
 */
export default function (app) {
  // 結果を作成
  app.post('/', async context => {
    try {
      console.log('Request received');
      const requestBody = await context.req.json();
      console.log('Request body:', requestBody);

      // 生年月日を取得
      const birthDate = new Date(requestBody.birthdate);
      console.log('Birth date:', birthDate);

      // 動物を取得
      const animalEntity = new AnimalEntity(birthDate);
      console.log('Animal entity:', animalEntity);

      // 各種占いサイトのサービスをインスタンス化
      // const maneqlSite = new ManeqlService(animalEntity.animal);
      const aoiService = new AoiService(animalEntity.character, requestBody.gender);
      const angrytellerService = new AngrytellerService(requestBody.familyName, requestBody.firstName);
      const astrolineService = new AstrolineService(birthDate);
      const askOracleService = new AskOracleService(birthDate);

      console.log('Fetching content from external services...');
      // xxxContentに各サイトの内容を格納
      const [aoiContent, angrytellerContent, astrolineContent, askOracleContent] = await Promise.all([
        // maneqlSite.getContent(),
        aoiService.getContent(),
        angrytellerService.getContent(),
        astrolineService.getContent(),
        askOracleService.getContent(),
      ]);
      console.log('External content fetched');

      // TODO: 取得した占いコンテンツ (aoiContent など) を `generateDiagnosis` に渡す必要があるか検討
      // (現状の `generateDiagnosis` は `formData` しか受け取っていない)

      // --- 新しい診断サービス呼び出し (ここから) ---
      console.log('Starting diagnosis generation...');
      // 新しいサービス関数を呼び出す (占いデータはまだ渡していない)
      const diagnosisResult = await generateDiagnosis(requestBody, context.env);
      console.log('Diagnosis generation completed');
      // --- 新しい診断サービス呼び出し (ここまで) ---

      // --- KVへの保存とレスポンス (ここから) ---
      const id = crypto.randomUUID();
      // KVには新しい診断結果 (diagnosisResult) を保存
      await context.env.KV.put(id, JSON.stringify(diagnosisResult));
      console.log(`Diagnosis result saved to KV with key: ${id}`);

      return context.json({
        id, // 生成した ID を返す
      });
      // --- KVへの保存とレスポンス (ここまで) ---

    } catch (error) {
      console.error('Error in results route:', error);
      console.error('Error stack:', error.stack);
      return context.json(
        {
          error: '分析中にエラーが発生しました',
          details: error.message,
          // process.env はブラウザではなく Worker 環境で参照するべきだが、wrangler dev では使えない場合があるため注意
          // stack: context.env.ENVIRONMENT === 'development' ? error.stack : undefined, // 環境変数で制御する例
          stack: error.stack, // 一旦スタックトレースを返す
        },
        500,
      );
    }
  });

  // 結果を取得
  app.get('/:id', async context => {
    const id = context.req.param('id');
    const result = await context.env.KV.get(id);

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
      result: JSON.parse(result),
    });
  });

  return app;
}
