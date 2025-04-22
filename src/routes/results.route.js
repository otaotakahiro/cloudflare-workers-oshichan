import { AnimalEntity } from '../domains/animal.entity';
// import { ManeqlService } from '../infrastructures/sites/maneql.service';
import { AngrytellerService } from '../infrastructures/sites/angryteller.service';
import { AstrolineService } from '../infrastructures/sites/astroline.service';
import { AskOracleService } from '../infrastructures/sites/ask-oracle.service';
import OpenaiService from '../infrastructures/ai/openai.service';
import { AoiService } from '../infrastructures/sites/aoi/aoi.service';

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

      // プロンプト: コンテンツ部分
      const contentsPrompBuilder = [];

      // if (maneqlContent) {
      //   contentsPrompBuilder.push(`## 動物占いの結果\n\n${maneqlContent}`);
      // }

      if (aoiContent) {
        contentsPrompBuilder.push(`## 動物占いの結果\n\n${aoiContent}`);
      }

      if (angrytellerContent) {
        contentsPrompBuilder.push(`## 姓名診断の結果\n\n${angrytellerContent}`);
      }

      if (astrolineContent) {
        contentsPrompBuilder.push(`## 占星術出生図の結果\n\n${astrolineContent}`);
      }

      if (askOracleContent) {
        contentsPrompBuilder.push(`## 数秘術の結果\n\n${askOracleContent}`);
      }

      // プロンプト: コンテンツ部分
      const contentsPrompt = contentsPrompBuilder.join('\n\n');
      console.log('Content prompt prepared');

      // ユーザーデータの準備
      const fullName = `${requestBody.familyName} ${requestBody.firstName}`;
      const birthDateFormatted = `${birthDate.getFullYear()}年${birthDate.getMonth() + 1}月${birthDate.getDate()}日`;
      const genderFormatted = requestBody.gender === 'male' ? '男性' : '女性';
      const analysisDate = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });

      const userData = {
        name: fullName,
        familyName: requestBody.familyName,
        firstName: requestBody.firstName,
        birthDate: birthDateFormatted,
        gender: genderFormatted,
        analysisDate: analysisDate,
        contentsPrompt: contentsPrompt,
        animalCharacter: animalEntity.character
      };

      // AIによる分析
      console.log('Starting OpenAI analysis...');
      const openaiService = new OpenaiService(context.env.OPENAI_API_KEY, context.env.OPENAI_MODEL);
      const result = await openaiService.analyzeAll(userData);
      console.log('OpenAI analysis completed');

      const id = crypto.randomUUID();
      await context.env.KV.put(id, JSON.stringify(result));

      return context.json({
        id,
      });
    } catch (error) {
      console.error('Error in results route:', error);
      console.error('Error stack:', error.stack);
      return context.json(
        {
          error: '分析中にエラーが発生しました',
          details: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
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
