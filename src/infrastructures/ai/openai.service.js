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

  /**
   * 指定されたシステムプロンプトとユーザープロンプトでOpenAI APIを呼び出す
   * @param {string} systemPrompt - システムプロンプト
   * @param {string} userPrompt - ユーザープロンプト
   * @param {boolean} expectJson - JSONオブジェクト形式での応答を期待するかどうか
   * @returns {Promise<object|string>} 解析されたJSONオブジェクトまたはテキスト応答
   */
  async callApiWithPrompts(systemPrompt, userPrompt, expectJson = true) {
    const start = Date.now();
    console.log(`[${this.sessionId}] Calling OpenAI API with custom prompts...`);

    // Fetch API を使用して OpenAI API を呼び出す
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const body = {
      model: this.model,
      messages: messages,
      temperature: 0.7, // 必要に応じて調整
      max_tokens: 3000, // 必要に応じて調整
    };

    // JSONモードを指定 (対応モデルの場合)
    // gpt-4-turbo (gpt-4-turbo-2024-04-09など) や gpt-3.5-turbo-0125 以降で利用可能
    if (expectJson && (this.model.includes('gpt-4-turbo') || this.model.includes('gpt-4o') || this.model.startsWith('gpt-3.5-turbo-0125') || this.model.startsWith('gpt-3.5-turbo-1106'))) {
      body.response_format = { type: 'json_object' };
      console.log(`[${this.sessionId}] Requesting JSON object format.`);
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    };

    try {
      // タイムアウト付きでAPIリクエストを実行 (例: 60秒)
      const response = await this.withTimeout(
        fetch('https://api.openai.com/v1/chat/completions', requestOptions),
        60000, // 60秒タイムアウト
        'OpenAI API request timed out after 60 seconds'
      );

      const end = Date.now();
      console.log(`[${this.sessionId}] OpenAI API call finished in ${(end - start) / 1000} seconds.`);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`[${this.sessionId}] OpenAI API Error: ${response.status}`, errorBody);
        throw new Error(`OpenAI API request failed with status ${response.status}: ${errorBody}`);
      }

      const apiResponse = await response.json();
      const content = apiResponse.choices?.[0]?.message?.content;

      if (!content) {
        console.error(`[${this.sessionId}] No content received from OpenAI API. Response:`, apiResponse);
        throw new Error('No content received from OpenAI API');
      }

      // レスポンスログを保存 (ユーザーデータは限定的に渡すか、渡さない。必要に応じて調整)
      // try {
      //   await this.saveResponseLog({ name: 'CustomPromptUser' }, content, 'customPrompt', apiResponse, systemPrompt, userPrompt);
      // } catch (logError) {
      //   console.warn(`Logging failed for customPrompt, but continuing: ${logError.message}`);
      // }


      if (expectJson) {
        console.log(`[${this.sessionId}] Parsing JSON response...`);
        const parsedJson = this.safeJsonParse(content);
        if (parsedJson.error) {
          console.error(`[${this.sessionId}] Failed to parse JSON response. Error: ${parsedJson.error}. Preview: ${parsedJson.preview}`);
          throw new Error(`Failed to parse JSON response from OpenAI: ${parsedJson.error}`);
        }
        console.log(`[${this.sessionId}] JSON parsed successfully.`);
        return parsedJson;
      } else {
        return content; // JSONを期待しない場合はテキストをそのまま返す
      }

    } catch (error) {
      console.error(`[${this.sessionId}] Error calling OpenAI API:`, error);
      throw error; // エラーを再スローして呼び出し元で処理
    }
  }
}

export default OpenaiService;
