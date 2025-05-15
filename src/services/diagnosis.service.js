// ここに推しちゃん診断のサービスロジックを実装します。
// 例: OpenAI API との連携、診断項目の生成など

import { OpenaiService } from '../infrastructures/ai/openai.service.js';
// generateBaseDiagnosisUserPrompt は呼び出し元で処理されるため、ここでは不要
// import {
//   BASE_DIAGNOSIS_SYSTEM_PROMPT, // 呼び出し元から渡される
//   generateBaseDiagnosisUserPrompt,
// } from '../prompts/base-diagnosis.prompt.js';

export const generateDiagnosis = async (
  systemPrompt,
  userPrompt,
  formData,
  schema, // 現在は未使用だが必要に応じて活用
  env,
  // externalSiteContents は userPrompt生成に使うため、この関数へは不要
) => {
  console.log("Generating diagnosis for:", formData);
  // if (externalSiteContents) { // externalSiteContents はここでは直接使わない
  //   console.log("With external site contents:", externalSiteContents);
  // }

  // --- OpenAI Service を使った分析処理 (ベース診断のみ実装) ---
  let baseDiagnosisResult = null;
  try {
    // APIキーは渡されたenvオブジェクトから取得
    if (!env || !env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not available in env object:', env);
      throw new Error('OpenAI API key is not configured in environment variables or env object is missing.');
    }
    const openaiService = new OpenaiService(env.OPENAI_API_KEY, env.OPENAI_MODEL || 'gpt-4-turbo');

    // userPrompt は引数で受け取るため、ここでの再生成は不要
    // const localUserPrompt = generateBaseDiagnosisUserPrompt(formData, externalSiteContents);

    console.log("--- Calling OpenAI for Base Diagnosis ---");
    console.log("System Prompt:", systemPrompt);
    console.log("User Prompt:", userPrompt);

    // 新しいメソッドを呼び出す
    const parsedJsonResult = await openaiService.callApiWithPrompts(
      systemPrompt, // 引数の systemPrompt を使用
      userPrompt,   // 引数の userPrompt を使用
      true // JSON応答を期待する
    );

    // 期待するキー (baseDiagnosis) が存在するかチェック (OpenAIからの応答構造に合わせる)
    // この例では、OpenAIが直接 { base: ... } のような構造を返すとは限らないため、
    // openaiService.callApiWithPrompts の応答がそのまま診断結果の 'base' 部分になることを期待する。
    // もしopenaiServiceが { baseDiagnosis: {...} } のような構造で返す場合は、以前のコードのようにアクセスする。
    // ここでは、parsedJsonResult が直接診断の主要部分を含むと仮定する。
    if (parsedJsonResult) {
      // 以前は parsedJsonResult を直接 baseDiagnosisResult に代入していた
      // OpenAIからの応答が { baseDiagnosis: {...} } の形式であることを期待する
      if (parsedJsonResult.baseDiagnosis) {
        baseDiagnosisResult = parsedJsonResult.baseDiagnosis; // ネストを一段階浅くする
        console.log("--- OpenAI Base Diagnosis (Core) Received Successfully ---");
        console.log("Received Base Diagnosis (Core):", JSON.stringify(baseDiagnosisResult, null, 2));
      } else {
        // もし直接診断結果のオブジェクトが返ってくる場合 (baseDiagnosisキーなし)
        baseDiagnosisResult = parsedJsonResult;
        console.log("--- OpenAI Base Diagnosis (Direct) Received Successfully ---");
        console.log("Received Base Diagnosis (Direct):", JSON.stringify(baseDiagnosisResult, null, 2));
      }
    } else {
      console.error('Invalid or empty JSON structure received from OpenAI for base diagnosis:', parsedJsonResult);
      throw new Error('OpenAIから予期しない、または空の形式の応答がありました (ベース診断)');
    }

  } catch (error) {
    console.error('Error during OpenAI base diagnosis:', error);
    // エラー発生時も、診断結果の構造を維持し、エラー情報を含める
    baseDiagnosisResult = { error: `ベース診断中にエラーが発生しました: ${error.message}` };
  }

  // --- 他の診断項目 (未実装) ---
  // const fortuneResult = await generateFortuneDiagnosis(formData, env);
  // ... etc ...

  // 最終的な診断結果を構築
  const diagnosisResult = {
    // baseDiagnosisResult がエラーでないことを確認してから代入
    base: baseDiagnosisResult && !baseDiagnosisResult.error ? baseDiagnosisResult : { error: (baseDiagnosisResult && baseDiagnosisResult.error) || 'ベース診断データの取得に失敗しました' },
    fortune: "運勢診断結果 (未実装)",
    love: "恋愛傾向診断結果 (未実装)",
    message: "オタクへのメッセージ風診断結果 (未実装)",
    fantasy: "妄想コンテンツ診断結果 (未実装)",
    magicWord: "魔法のひとこと診断結果 (未実装)",
    praisePoint: "褒められたいポイント診断結果 (未実装)",
  };

  console.log("Final diagnosis result structure:", JSON.stringify(diagnosisResult, null, 2));
  return diagnosisResult;
};
