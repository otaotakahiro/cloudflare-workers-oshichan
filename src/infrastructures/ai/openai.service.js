import { OVERVIEW_PROMPT } from './prompts/overview-prompt.js';
import { SKILLS_PROMPT } from './prompts/skills-prompt.js';
import { CAREER_PROMPT } from './prompts/career-prompt.js';
import { FUTURE_PROMPT } from './prompts/future-prompt.js';
import { PLUS_PROMPT } from './prompts/plus-prompt.js';

export class OpenaiService {
  constructor(apiKey, model = 'gpt-4.1-mini') {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }
    this.apiKey = apiKey;
    this.model = model;

    this.sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    console.log(`Session ID: ${this.sessionId}`);
  }

  /**
   * @param {string} firstName
   * @param {string} familyName
   * @param {string} firstNameKana
   * @param {string} familyNameKana
   * @param {Date} birthDate
   * @param {string} gender
   * @param {string} animalCharacter
   * @param {string} additionalPrompt
   */
  async analyzeAll(userData) {
    const start = Date.now();
    const results = await Promise.allSettled([
      this.analyzeTab(userData, OVERVIEW_PROMPT, 'overview'),
      this.analyzeTab(userData, SKILLS_PROMPT, 'skills'),
      this.analyzeTab(userData, CAREER_PROMPT, 'career'),
      this.analyzeTab(userData, FUTURE_PROMPT, 'future'),
      this.analyzeTab(userData, PLUS_PROMPT, 'plus')
    ]);

    const allData = {};
    const resultStatus = {};

    results.forEach((result, index) => {
      const types = ['overview', 'skills', 'career', 'future', 'plus'];
      const type = types[index];

      if (result.status === 'fulfilled') {
        allData[type] = result.value;
        resultStatus[type] = 'success';
      } else {
        console.error(`Error analyzing ${type}:`, result.reason);
        allData[type] = null;
        resultStatus[type] = 'error';
      }
    });

    const end = Date.now();
    console.log(`Analysis completed in ${(end - start) / 1000} seconds`);

    // ユーザーの基本情報もレスポンスに含める
    const userInfo = {
      name: userData.name,
      birthDate: userData.birthDate,
      gender: userData.gender,
      analysisDate: userData.analysisDate
    };

    return {
      data: {
        ...allData,
        userInfo // ユーザー基本情報を追加
      },
      status: resultStatus
    };
  }

  /**
   * APIリクエストをタイムアウト付きで実行する
   * @param {Promise} promise - 実行するPromise
   * @param {number} timeout - タイムアウト時間（ミリ秒）
   * @param {string} errorMessage - タイムアウト時のエラーメッセージ
   * @returns {Promise} 元のPromiseまたはタイムアウトエラー
   */
  async withTimeout(promise, timeout = 30000, errorMessage = 'Request timed out') {
    let timeoutId;

    // タイムアウト用のPromiseを作成
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(errorMessage));
      }, timeout);
    });

    // レース条件でどちらか早く終了した方を返す
    try {
      const result = await Promise.race([promise, timeoutPromise]);
      clearTimeout(timeoutId);
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * ユーザー入力をサニタイズする
   * @param {string} input - サニタイズするテキスト
   * @returns {string} サニタイズされたテキスト
   */
  sanitizeInput(input) {
    if (!input) return '';

    // 潜在的に危険な文字をエスケープ
    return String(input)
      .replace(/[\\"`]/g, '\\$&')  // バックスラッシュ、ダブルクォーテーション、バッククォートをエスケープ
      .replace(/[<>]/g, '')        // HTMLタグを削除
      .replace(/```/g, '')         // Markdownのコードブロックを削除
      .replace(/system:/gi, '')    // システムプロンプト操作を防止
      .replace(/\n\s*\n\s*\n/g, '\n\n'); // 過剰な改行を削除
  }

  /**
   * レスポンスの詳細をコンソールログに出力する
   * @param {string} type - プロンプトの種類
   * @param {Object} userData - ユーザー情報
   * @param {Object} response - APIレスポンス
   * @param {string} promptTemplate - 使用したプロンプトテンプレート
   * @param {string} userPromptContent - ユーザープロンプトの内容
   * @param {string} content - APIからのレスポンス内容
   */
  async saveResponseLog(userData, content, type, apiResponse, promptTemplate, userPromptContent) {
    try {
      const timestamp = new Date().toISOString();
      const sanitizedName = this.sanitizeFileName(userData.name);

      console.log(`\n================ [${timestamp}] ${type} PROMPT & RESPONSE ================`);
      console.log('SESSION ID:', this.sessionId);

      // ユーザー情報を出力
      console.log('\n--- USER INFO ---');
      console.log(JSON.stringify({
        name: userData.name,
        familyName: userData.familyName,
        firstName: userData.firstName,
        birthDate: userData.birthDate,
        gender: userData.gender,
        analysisDate: userData.analysisDate
      }, null, 2));

      // プロンプト内容（一部のみ）を出力
      console.log('\n--- SYSTEM PROMPT (FIRST 300 CHARS) ---');
      console.log(promptTemplate.substring(0, 300) + (promptTemplate.length > 300 ? '...' : ''));

      console.log('\n--- USER PROMPT ---');
      // console.log(userPromptContent); 非表示
      console.log('※※※長いので省略※※※');

      // APIレスポンス情報を出力
      console.log('\n--- API RESPONSE INFO ---');
      console.log(JSON.stringify({
        model: apiResponse.model,
        usage: apiResponse.usage,
        finishReason: apiResponse.choices?.[0]?.finish_reason
      }, null, 2));

      // レスポンス内容（一部）を出力
      console.log('\n--- CONTENT PREVIEW (FIRST 300 CHARS) ---');
      console.log(content.substring(0, 300) + (content.length > 300 ? '...' : ''));

      // 解析したJSONの構造を出力
      try {
        const parsedJson = this.safeJsonParse(content);
        console.log('\n--- PARSED JSON STRUCTURE ---');
        // JSON構造のキーのみ出力（内容は省略）
        console.log(this.getJsonStructure(parsedJson));
      } catch (err) {
        console.log('\n--- JSON PARSE ERROR ---');
        console.log(err.message);
      }

      console.log('\n=====================================================================\n');
    } catch (err) {
      console.error(`Error logging ${type} response:`, err);
    }
  }

  /**
   * JSONの構造（キーのみ）を取得する
   */
  getJsonStructure(obj, depth = 0, maxDepth = 3) {
    if (depth >= maxDepth) return '...';
    if (!obj || typeof obj !== 'object') return typeof obj;

    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      return `[${typeof obj[0]} × ${obj.length}]`;
    }

    const result = {};
    for (const key in obj) {
      result[key] = this.getJsonStructure(obj[key], depth + 1, maxDepth);
    }
    return result;
  }

  /**
   * 安全にJSONをパースする
   */
  safeJsonParse(content) {
    try {
      // Markdownコードブロックからの抽出
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      let jsonContent;

      if (jsonMatch) {
        jsonContent = jsonMatch[1];
      } else if (content.trim().startsWith('{') && content.trim().endsWith('}')) {
        // コードブロックがない場合は直接JSONとして解析
        jsonContent = content;
      } else {
        return { error: "Not JSON format", preview: content.substring(0, 100) };
      }

      return JSON.parse(jsonContent);
    } catch (error) {
      return { error: error.message, preview: content.substring(0, 100) };
    }
  }

  sanitizeFileName(name) {
    return (name || 'unknown').replace(/[^\w\s-]/g, '').trim();
  }

  buildPrompt(userData, promptTemplate) {
    return promptTemplate
      .replace('{{name}}', userData.name || '')
      .replace('{{gender}}', userData.gender || '')
      .replace('{{birthDate}}', userData.birthDate || '');
  }

  /**
   * 各タブのコンテンツをAPIリクエストで取得
   * @param {Object} userData - ユーザー情報
   * @param {string} userData.name - フルネーム（姓名）
   * @param {string} userData.familyName - 姓
   * @param {string} userData.firstName - 名
   * @param {string} userData.birthDate - 生年月日
   * @param {string} userData.gender - 性別
   * @param {string} userData.analysisDate - 分析日
   * @param {string} userData.contentsPrompt - 各種占い結果をまとめたテキスト
   * @param {string} userData.animalCharacter - 動物キャラクター
   * @param {string} type - プロンプトの種類（'overview', 'skills', 'career', 'future', 'plus'）
   * @returns {Promise<Object>} - 全タブのコンテンツを含むオブジェクト
   */
  async analyzeTab(userData, promptTemplate, type) {
    try {
      // すべてのユーザー入力をサニタイズ
      const name = this.sanitizeInput(userData.name);
      const familyName = this.sanitizeInput(userData.familyName);
      const firstName = this.sanitizeInput(userData.firstName);
      const birthDate = this.sanitizeInput(userData.birthDate);
      const gender = this.sanitizeInput(userData.gender);
      const analysisDate = this.sanitizeInput(userData.analysisDate);
      let contentsPrompt = userData.contentsPrompt ? this.sanitizeInput(userData.contentsPrompt) : '';

      let userPromptContent = `
対象者情報：
・姓： ${familyName}
・名： ${firstName}
・フルネーム: ${name}
・生年月日: ${birthDate}
・性別: ${gender}
・分析日: ${analysisDate}

上記の情報に基づいて、人材プロファイリング分析を行ってください。
`;

      // 追加のコンテンツ情報があれば追加
      if (contentsPrompt) {
        userPromptContent += `\n\n${contentsPrompt}`;
      }

      // タイムアウト付きでAPIリクエストを実行
      const response = await this.withTimeout(
        fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            messages: [
              { role: 'system', content: promptTemplate },
              { role: 'user', content: userPromptContent }
            ],
            temperature: 0.7,
            max_tokens: 2000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          }),
        }),
        60000, // 60秒のタイムアウト
        'OpenAI API request timed out after 60 seconds'
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('OpenAI API Error:', error);
        throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'} (HTTP ${response.status})`);
      }

      const data = await response.json();

      // JSONレスポンスの抽出と解析
      const content = data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in response from OpenAI API');
      }

      // コンソールへのログ出力とファイル保存
      try {
        await this.saveResponseLog(userData, content, type, data, promptTemplate, userPromptContent);
      } catch (logError) {
        // ロギングに失敗しても処理は続行
        console.warn(`Logging failed for ${type}, but continuing: ${logError.message}`);
      }

      // Markdownコードブロックからの抽出
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      let jsonContent;

      if (jsonMatch) {
        jsonContent = jsonMatch[1];
      } else if (content.trim().startsWith('{') && content.trim().endsWith('}')) {
        // コードブロックがない場合は直接JSONとして解析
        jsonContent = content;
      } else {
        console.warn(`No JSON format found in response. Using raw content. Response begins with: ${content.substring(0, 100)}...`);
        jsonContent = content;
      }

      try {
        return JSON.parse(jsonContent);
      } catch (error) {
        console.error('Error parsing JSON response:', error);
        console.error('Raw content:', jsonContent.substring(0, 200));
        throw new Error('JSONの解析に失敗しました。APIの応答形式が想定と異なります。');
      }
    } catch (error) {
      console.error('Analysis Tab Error:', error);
      throw error;
    }
  }
}

export default OpenaiService;
