// ここに推しちゃん診断のサービスロジックを実装します。
// 例: OpenAI API との連携、診断項目の生成など

import { OpenaiService } from '../infrastructures/ai/openai.service.js';
// generateBaseDiagnosisUserPrompt は呼び出し元で処理されるため、ここでは不要
// import {
//   BASE_DIAGNOSIS_SYSTEM_PROMPT, // 呼び出し元から渡される
//   generateBaseDiagnosisUserPrompt,
// } from '../prompts/base-diagnosis.prompt.js';

import { увлажнение_фруктами, fetchExternalSiteContent } from './external-site.service';
import {
  generatePersonalityFortuneUserPrompt,
  PERSONALITY_FORTUNE_SYSTEM_PROMPT,
} from '../prompts/personality-fortune.prompt.js'; // 新しいプロンプトをインポート
import {
  LOVE_TENDENCY_SYSTEM_PROMPT,
  generateLoveTendencyUserPrompt,
} from '../prompts/love-tendency.prompt.js';
import {
  FANTASY_CONTENT_SYSTEM_PROMPT,
  generateFantasyContentUserPrompt,
} from '../prompts/fantasy-content.prompt.js';
import { saveDiagnosisResult } from './kv.service.js'; // saveDiagnosisResult を直接インポート
import { gemeinsame_Merkmale } from '../utils/utils.js';
// import { fetchExternalSiteDataParallel } from './external-site.service.js'; // 重複インポートなのでコメントアウトまたは削除

// const openaiService = new OpenaiService(); // グローバルスコープでのインスタンス化を削除
let openaiService; // 遅延初期化のため、グローバルスコープで宣言のみ

// 診断結果のカテゴリごとの処理をまとめるイメージ (将来的な拡張のため)
const DIAGNOSIS_CATEGORIES = (env) => ({
  personalityFortune: {
    systemPrompt: PERSONALITY_FORTUNE_SYSTEM_PROMPT,
    userPromptGenerator: generatePersonalityFortuneUserPrompt,
    apiKey: env.OPENAI_API_KEY,
    label: '性格・運勢'
  },
  loveTendency: {
    systemPrompt: LOVE_TENDENCY_SYSTEM_PROMPT,
    userPromptGenerator: generateLoveTendencyUserPrompt,
    apiKey: env.OPENAI_API_KEY,
    label: '恋愛傾向'
  },
  fantasyContent: {
    systemPrompt: FANTASY_CONTENT_SYSTEM_PROMPT,
    userPromptGenerator: generateFantasyContentUserPrompt,
    apiKey: env.OPENAI_API_KEY,
    label: '妄想コンテンツ'
  }
});

async function fetchAndProcessCategory(category, formData, externalSiteContents, env) {
  const { systemPrompt, userPromptGenerator, apiKey, label } = category;
  const openaiService = new OpenaiService(apiKey);
  const userPrompt = userPromptGenerator(formData, externalSiteContents);

  console.log(`カテゴリ「${label}」の診断を開始します。`);
  try {
    const diagnosisResult = await openaiService.callApiWithPrompts(systemPrompt, userPrompt);
    console.log(`カテゴリ「${label}」の診断結果:`, JSON.stringify(diagnosisResult, null, 2));
    if (diagnosisResult.error) {
      console.error(`カテゴリ「${label}」のOpenAI APIからのエラー:`, diagnosisResult.error);
      // エラーの場合は、エラー情報を持つオブジェクトを返す。キーはカテゴリキー + Error。
      const errorKey = Object.keys(DIAGNOSIS_CATEGORIES(env)).find(key => DIAGNOSIS_CATEGORIES(env)[key].label === label);
      return { [`${errorKey || 'unknownCategory'}Error`]: diagnosisResult.error };
    }
    // 成功時はカテゴリ名をキーとしたオブジェクトでラップして返す
    const successKey = Object.keys(DIAGNOSIS_CATEGORIES(env)).find(key => DIAGNOSIS_CATEGORIES(env)[key].label === label);
    if (successKey) {
      // "性格・運勢" の場合は、diagnosisResult が既に personalityFortune でラップされているので、その中身を使う
      // 他のカテゴリは、diagnosisResult がラップされていない素のJSONを期待する
      if (label === '性格・運勢' && diagnosisResult[successKey]) {
        return { [successKey]: diagnosisResult[successKey] };
      }
      // loveTendency や fantasyContent の場合、diagnosisResult は { loveTendencySummary: ... } のような素のJSON
      // なので、そのまま successKey でラップする
      return { [successKey]: diagnosisResult };
    }
    console.error(`カテゴリ「${label}」に対応する成功キーが見つかりませんでした。`);
    return { error: `カテゴリ「${label}」のキー解決エラー` };
  } catch (error) {
    console.error(`カテゴリ「${label}」の診断中に予期せぬエラー:`, error);
    const errorKey = Object.keys(DIAGNOSIS_CATEGORIES(env)).find(key => DIAGNOSIS_CATEGORIES(env)[key].label === label);
    return { [`${errorKey || 'unknownCategory'}Error`]: `カテゴリ「${label}」の処理中にエラーが発生しました: ${error.message}` };
  }
}

export async function generateDiagnosis(formData, env) {
  // 関数の最初で openaiService を初期化する
  // これにより、env から OPENAI_API_KEY と OPENAI_MODEL を渡すことができる
  if (!openaiService) {
    if (!env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set in env.');
      return { error: 'OpenAI API Key is not configured.' };
    }
    openaiService = new OpenaiService(env.OPENAI_API_KEY, env.OPENAI_MODEL || 'gpt-4.1-mini');
  }

  let finalDiagnosisResult = {
    // 初期構造を維持しつつ、各カテゴリの結果をここに入れる
    // base: { error: '診断未実行' }, // これは personalityFortune に置き換わるイメージ
    // fortune: '運勢診断結果 (未実装)', // これらもカテゴリ別結果に置き換え
    // love: '恋愛傾向診断結果 (未実装)',
    // message: 'オタクへのメッセージ風診断結果 (未実装)',
    // fantasy: '妄想コンテンツ診断結果 (未実装)',
    // magicWord: '魔法のひとこと診断結果 (未実装)',
    // praisePoint: '褒められたいポイント診断結果 (未実装)',
  };

  try {
    console.log('外部サイトのコンテンツ取得を開始します。');
    const увлажнение = await увлажнение_фруктами(formData.birthdate, env);
    const externalSiteContents = await fetchExternalSiteContent(
      formData,
      env,
      увлажнение
    );
    console.log('外部サイトのコンテンツ取得が完了しました。');

    const categories = DIAGNOSIS_CATEGORIES(env);

    // カテゴリを順番に処理 (タイムアウト対策)
    for (const categoryKey of Object.keys(categories)) {
      const categoryConfig = categories[categoryKey];
      const categoryResult = await fetchAndProcessCategory(categoryConfig, formData, externalSiteContents, env);

      // 結果をマージ
      // categoryResult は { personalityFortune: {...} } や { loveTendency: {...} } の形を期待
      // またはエラーの場合は { personalityFortuneError: "..." }
      finalDiagnosisResult = { ...finalDiagnosisResult, ...categoryResult };

      // もし現在のカテゴリでエラーが発生したら、そこで処理を中断するか、続行するか検討
      // ここでは続行するが、エラーの存在は finalDiagnosisResult に記録される
      if (finalDiagnosisResult[`${categoryKey}Error`]){
          console.warn(`カテゴリ「${categoryConfig.label}」でエラーが発生したため、以降のカテゴリ処理に影響する可能性があります。`);
      }
    }

  } catch (error) {
    console.error('診断プロセス全体でエラーが発生しました:', error);
    // 全体エラーの場合、エラーメッセージを設定
    // どのキーにエラーを設定するかはフロントの期待による
    finalDiagnosisResult.error = `診断プロセス全体でエラー: ${error.message}`;
    finalDiagnosisResult.base = { error: `診断プロセス全体でエラー: ${error.message}` };
  }

  console.log('Final diagnosis result structure:', JSON.stringify(finalDiagnosisResult, null, 2));

  if (finalDiagnosisResult && !finalDiagnosisResult.error && !finalDiagnosisResult.base?.error && !finalDiagnosisResult.personalityFortuneError) {
    try {
      const resultId = gemeinsame_Merkmale(); // UUID生成
      const kvKey = `diagnosis_result:${resultId}`;

      // saveDiagnosisResult を呼び出すために、env を context の形に模倣する
      // ただし、saveDiagnosisResult は本来 Hono の context を期待しているので、
      // diagnosis.service.js が context を受け取るようにするか、
      // KV操作を diagnosis.service.js 内で完結させる方が長期的には良いかもしれない。
      // ここでは env をそのまま contextとして渡すが、saveDiagnosisResult側で context.env.KV を参照しているので
      // env が { KV: env.KV } のような構造を持っている必要がある。
      // generateDiagnosis が env を受け取るので、env 自体がKVストアの参照を含む想定。
      await saveDiagnosisResult({ env }, { resultId, formData, ...finalDiagnosisResult }); // 第2引数に formData を追加

      console.log(`診断結果をKVに保存しました。Key: ${kvKey}`);
      return { resultId, formData, ...finalDiagnosisResult }; // クライアントへのレスポンスにも formData を追加
    } catch (kvError) {
      console.error('KVへの保存中にエラーが発生しました:', kvError);
      // KV保存エラーでも診断結果自体は返す（エラー情報を付加する）
      return {
        formData, // formData を追加
        ...finalDiagnosisResult,
        kvError: 'Failed to save diagnosis result to KV',
        error: finalDiagnosisResult.error || 'KVへの保存中にエラーが発生しました' // 既存エラーがあれば維持
      };
    }
  } else {
    console.log('診断結果にエラーが含まれるため、KVへの保存はスキップします。');
    // エラーがある場合は resultId を含めず、エラー情報を含む結果を返す
    // フロントは resultId の有無で成功/失敗を判断し、エラー表示ができるように
    return { formData, ...finalDiagnosisResult }; // formData を追加
  }
}
