// ここに推しちゃん診断のサービスロジックを実装します。
// 例: OpenAI API との連携、診断項目の生成など

import { OpenaiService } from '../infrastructures/ai/openai.service.js';
import {
  BASE_DIAGNOSIS_SYSTEM_PROMPT,
  generateBaseDiagnosisUserPrompt,
} from '../prompts/base-diagnosis.prompt.js';

export const generateDiagnosis = async (formData, env) => {
  console.log("Generating diagnosis for:", formData);

  // --- OpenAI Service を使った分析処理 (ベース診断のみ実装) ---
  let baseDiagnosisResult = null;
  try {
    // APIキーは環境変数から取得
    if (!env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured in environment variables.');
    }
    const openaiService = new OpenaiService(env.OPENAI_API_KEY, env.OPENAI_MODEL || 'gpt-4-turbo'); // モデル名を指定、なければデフォルト

    const userPrompt = generateBaseDiagnosisUserPrompt(formData);

    console.log("--- Calling OpenAI for Base Diagnosis ---");

    // 新しいメソッドを呼び出す
    const parsedJsonResult = await openaiService.callApiWithPrompts(
      BASE_DIAGNOSIS_SYSTEM_PROMPT,
      userPrompt,
      true // JSON応答を期待する
    );

    // 期待するキー (baseDiagnosis) が存在するかチェック
    if (parsedJsonResult && parsedJsonResult.baseDiagnosis) {
      baseDiagnosisResult = parsedJsonResult.baseDiagnosis;
      console.log("--- OpenAI Base Diagnosis Received Successfully ---");
      console.log("Received Base Diagnosis:", JSON.stringify(baseDiagnosisResult, null, 2));
    } else {
      console.error('Invalid JSON structure received from OpenAI for base diagnosis:', parsedJsonResult);
      throw new Error('OpenAIから予期しない形式の応答がありました (ベース診断)');
    }

  } catch (error) {
    console.error('Error during OpenAI base diagnosis:', error);
    baseDiagnosisResult = { error: `ベース診断中にエラーが発生しました: ${error.message}` };
  }

  // --- 他の診断項目 (未実装) ---
  // const fortuneResult = await generateFortuneDiagnosis(formData, env);
  // ... etc ...

  // 最終的な診断結果を構築
  const diagnosisResult = {
    base: baseDiagnosisResult,
    fortune: "運勢診断結果 (未実装)",
    love: "恋愛傾向診断結果 (未実装)",
    message: "オタクへのメッセージ風診断結果 (未実装)",
    fantasy: "妄想コンテンツ診断結果 (未実装)",
    magicWord: "魔法のひとこと診断結果 (未実装)",
    praisePoint: "褒められたいポイント診断結果 (未実装)",
  };

  return diagnosisResult;
};
