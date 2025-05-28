// import { kv } from '@vercel/kv'; // Vercel KV を使用 ← 削除
import { v4 as uuidv4 } from 'uuid';

const KV_PREFIX = 'diagnosis_result:';

/**
 * KVに診断結果を保存します。
 * @param {any} context - Honoのコンテキストオブジェクト (c.env.KV を使用するため)
 * @param {object} data - 保存する診断結果のデータ
 * @returns {Promise<string>} 保存された結果のID (キー)
 * @throws {Error} KVへの保存に失敗した場合
 */
export async function saveDiagnosisResult(context, data) {
  if (!context || !context.env || !context.env.KV) {
    console.error('[KV Service] KV binding is not available in the context for save.');
    throw new Error('KV binding is not configured.');
  }
  // data オブジェクトに resultId が含まれている前提で、それを使用する
  // もし data.resultId がなければ、新たに生成する（現在の diagnosis.service.js の使い方では data.resultId が渡される想定）
  const id = data.resultId || uuidv4();
  const key = `${KV_PREFIX}${id}`;
  const dataToStore = JSON.stringify(data);
  console.log(`[KV Service] Attempting to save data to KV. Key: ${key}, Data size: ${dataToStore.length} bytes.`);
  // console.log(`[KV Service] Data to store (first 500 chars): ${dataToStore.substring(0, 500)}`); // デバッグ用にデータ内容もログ出力

  try {
    await context.env.KV.put(key, dataToStore);
    console.log(`[KV Service] Successfully saved data to KV. Key: ${key}`);
    return id;
  } catch (error) {
    console.error(`[KV Service] Error saving data to KV. Key: ${key}, Error:`, error);
    throw new Error(`KVへの保存に失敗しました: ${error.message}`);
  }
}

/**
 * KVから診断結果を取得します。
 * @param {any} context - Honoのコンテキストオブジェクト (c.env.KV を使用するため)
 * @param {string} id - 取得する結果のID
 * @returns {Promise<object|null>} 取得した診断結果、または見つからない場合はnull
 */
export async function getDiagnosisResult(context, id) {
  if (!context || !context.env || !context.env.KV) {
    console.error('[KV Service] KV binding is not available in the context for get.');
    return null;
  }
  const key = `${KV_PREFIX}${id}`;
  console.log(`[KV Service] Attempting to get data from KV. Key: ${key}`);
  try {
    const value = await context.env.KV.get(key, { type: 'text' }); // まずは text で取得

    if (value === null) {
      console.log(`[KV Service] Key not found in KV: ${key}`);
      return null;
    }
    console.log(`[KV Service] Successfully retrieved data from KV. Key: ${key}, Data size: ${value.length} bytes.`);
    // console.log(`[KV Service] Retrieved data (first 500 chars): ${value.substring(0, 500)}`);

    // 手動でJSONパースし、エラーがあればログに出す
    try {
      const parsedValue = JSON.parse(value);
      console.log(`[KV Service] Successfully parsed JSON data for key: ${key}`);
      return parsedValue;
    } catch (parseError) {
      console.error(`[KV Service] Error parsing JSON data from KV. Key: ${key}, Error:`, parseError);
      console.error(`[KV Service] Raw data from KV (first 500 chars): ${value.substring(0,500)}`);
      return { error: 'Failed to parse diagnosis result from KV.', details: parseError.message };
    }

  } catch (error) {
    console.error(`[KV Service] Error getting data from KV. Key: ${key}, Error:`, error);
    return null;
  }
}
