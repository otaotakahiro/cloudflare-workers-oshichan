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
    console.error('KV binding is not available in the context.');
    throw new Error('KV binding is not configured.');
  }
  const id = uuidv4();
  const key = `${KV_PREFIX}${id}`;
  try {
    // Cloudflare KV に JSON 文字列として保存
    await context.env.KV.put(key, JSON.stringify(data));
    console.log(`診断結果をKVに保存しました。Key: ${key}`);
    return id; // キーではなくID部分だけを返す方が一般的かもしれません
  } catch (error) {
    console.error(`KVへの保存中にエラーが発生しました (ID: ${id}):`, error);
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
    console.error('KV binding is not available in the context.');
    return null; // またはエラーをスロー
  }
  const key = `${KV_PREFIX}${id}`;
  try {
    const value = await context.env.KV.get(key, { type: 'json' }); // type: 'json' を指定して自動パース
    if (value === null) {
      console.log(`KVからキーが見つかりませんでした: ${key}`);
      return null;
    }
    console.log(`KVから診断結果を取得しました。Key: ${key}`);
    return value;
  } catch (error) {
    console.error(`KVからの取得中にエラーが発生しました (Key: ${key}):`, error);
    return null; // またはエラーをスロー
  }
}
