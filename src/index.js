import { Hono } from 'hono';
// import { serveStatic } from 'hono/cloudflare-workers'; // serveStatic のインポートを削除
import assessmentRoute from './routes/assessment.route';

const app = new Hono();

// HTML content with loading overlay
const formHtml = `
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <base href="/assessment/">
    <title>私の推しちゃん診断（仮）</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
    <link href="styles/main.css" rel="stylesheet" />
    <script>
      // このスクリプトブロックはプレースホルダ置換のため、HTMLの早い段階に移動・作成
      const APP_BASE_URL = '__APP_BASE_URL__'; // デプロイ時に置換されるプレースホルダ
    </script>
  </head>
  <body>
    <!-- Loading Overlay -->
    <div id="loading-overlay" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex flex-col items-center justify-center z-50 hidden">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4"></div>
      <p class="text-white text-xl">分析中です...</p>
    </div>

    <div class="container">
      <h1 class="main-title">私の推しちゃん診断（仮）#08</h1>
      <p>Debug Base URL: __APP_BASE_URL__</p>
      <form onsubmit="submitForm(event)" class="max-w-lg mx-auto">
        <div class="mb-4 flex gap-4">
          <div class="w-1/2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="familyName"> 推しの名前（姓） </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="familyName"
              name="familyName"
              type="text"
              required
              value="クォン"
            />
          </div>
          <div class="w-1/2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="firstName"> 推しの名前（名） </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="firstName"
              name="firstName"
              type="text"
              required
              value="ジヨン"
            />
          </div>
        </div>
        <div class="mb-4 flex gap-4">
          <div class="w-1/2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="familyNameKana"> 推しの名前（姓ふりがな） </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="familyNameKana"
              name="familyNameKana"
              type="text"
              required
              value="クォン"
            />
          </div>
          <div class="w-1/2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="firstNameKana"> 推しの名前（名ふりがな） </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="firstNameKana"
              name="firstNameKana"
              type="text"
              required
              value="ジヨン"
            />
          </div>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="birthdate"> 推しの誕生日 </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="birthdate"
            name="birthdate"
            type="date"
            required
            value="1988-08-18"
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2"> 推しの性別 </label>
          <div class="radio-group">
            <label class="radio-option">
              <input type="radio" name="gender" value="male" required checked />
              <span>男性</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="gender" value="female" />
              <span>女性</span>
            </label>
          </div>
        </div>
        <div class="text-center">
          <button class="btn btn-primary" type="submit">
            診断する
          </button>
        </div>
      </form>
    </div>

    <script>
      async function submitForm(event) {
        event.preventDefault();
        const submitButton = document.querySelector('button[type="submit"]');
        const loadingOverlay = document.getElementById('loading-overlay');

        // Show loading overlay
        loadingOverlay.classList.remove('hidden');
        submitButton.disabled = true; // Keep button disabled during loading

        try {
          const formData = new FormData(event.target);
          const response = await fetch('api/results', { // APIパスは base href により /assessment/api/results となる
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const result = await response.json();
            // Redirect to results page - loading overlay will disappear on navigation
            // APP_BASE_URL を使って完全なURLを生成
            if (APP_BASE_URL && APP_BASE_URL !== '__APP_BASE_URL__') {
              window.location.href = APP_BASE_URL + '/assessment/result-tabs?id=' + result.id;
            } else {
              // 環境変数が設定されていない場合のフォールバック (ローカル開発用など)
              window.location.href = '/assessment/result-tabs?id=' + result.id;
            }
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error || '分析に失敗しました');
          }
        } catch (error) {
          alert(error.message);
          // Hide loading overlay on error
          loadingOverlay.classList.add('hidden');
          submitButton.disabled = false; // Re-enable button on error
        }
        // No need to hide overlay or re-enable button on success here,
        // as the page navigation handles it.
      }
    </script>

    <footer>
      <p>© 2025 私の推しちゃん診断（仮）</p>
    </footer>
  </body>
</html>
`;

// --- Hono アプリケーション ---

// フォーム表示 (GET /)
// このワーカーが /assessment/ にマッピングされている場合、
// oshichan.com/assessment/ へのアクセスでこのハンドラが呼ばれる。
app.get('/', (c) => {
  console.log('--- Root Handler (/) ---');
  console.log('Request URL:', c.req.url);
  console.log('APP_BASE_URL from env:', c.env.APP_BASE_URL);
  const appBaseUrl = c.env.APP_BASE_URL || '';
  const renderedHtml = formHtml.replace(/__APP_BASE_URL__/g, appBaseUrl);

  console.log('Includes https://oshichan.com:', renderedHtml.includes('https://oshichan.com'));
  console.log('First 200 chars of renderedHtml:', renderedHtml.substring(0, 200));
  console.log('---------------------------');

  return c.html(renderedHtml);
});

// APIルートを assessment.route.js から直接登録
assessmentRoute(app); // assessmentRoute に app を渡して実行

// 静的ファイル配信 (ASSETS バインディングを使用)
// /assessment/* へのリクエスト (例: /assessment/styles/main.css) を処理
app.get('/assessment/*', async (c) => {
  let assetPath = c.req.path.replace(/^\/assessment\//, '');
  const originalUrl = new URL(c.req.url);

  console.log(`--- Static Asset Handler (/assessment/*) ---`);
  console.log(`Original request path: ${c.req.path}`);
  console.log(`Derived assetPath for ASSETS binding: ${assetPath}`);

  // /assessment/result-tabs?id=... のようなリクエストの場合、assetPath は 'result-tabs' となる。
  // これを 'result-tabs.html' にマッピングする。
  if (assetPath === 'result-tabs' && originalUrl.searchParams.has('id')) {
    assetPath = 'result-tabs.html';
    console.log(`Remapped assetPath to ${assetPath} for result-tabs with id.`);
  }

  // assetPathが空 (例: /assessment/ への直接アクセスで、上のルートにマッチしなかった場合) やディレクトリを示す場合
  if (assetPath === '' || assetPath.endsWith('/')) {
    // 今回の設計では /assessment/ は上の app.get('/') で formHtml を返す想定。
    // /assessment/some-directory/ のような場合は index.html を探すか 404 を返す。
    // ここでは、具体的なファイル名が期待されるため、そのようなリクエストは 404 とする。
    console.log(`Asset path is empty or ends with '/', returning 404.`);
    return c.notFound();
  }

  // ASSETS.fetch に渡すリクエストURLを構築
  // ASSETSバインディングは、バインディングのルートからのパスを期待する
  // (例: public/styles/main.css なら styles/main.css)
  const assetRequestUrl = new URL(originalUrl.origin); // https://example.com
  assetRequestUrl.pathname = assetPath; // styles/main.css
  assetRequestUrl.search = originalUrl.search; // クエリパラメータを保持

  try {
    // c.req.raw を使うことで、元のリクエストのヘッダーやメソッドを保持
    const assetRequest = new Request(assetRequestUrl.toString(), c.req.raw);
    console.log(`Fetching from ASSETS: ${assetRequest.url}`);

    let response = await c.env.ASSETS.fetch(assetRequest);

    // アセットが見つからず (404)、かつパスに拡張子がなく、末尾スラッシュでもない場合 (例: /assessment/somepage)
    // somepage.html を試すフォールバックロジック
    if (response.status === 404 && !assetPath.includes('.') && !assetPath.endsWith('/')) {
      const htmlAssetPath = assetPath + '.html';
      console.log(`Asset ${assetPath} not found, trying ${htmlAssetPath}`);
      const htmlAssetRequestUrl = new URL(originalUrl.origin);
      htmlAssetRequestUrl.pathname = htmlAssetPath;
      htmlAssetRequestUrl.search = originalUrl.search;
      const htmlAssetRequest = new Request(htmlAssetRequestUrl.toString(), c.req.raw);
      const htmlResponse = await c.env.ASSETS.fetch(htmlAssetRequest);

      if (htmlResponse.status !== 404) {
        console.log(`Found ${htmlAssetPath}`);
        response = htmlResponse; // HTMLファイルが見つかったらそれを使用
      }
    }

    if (response.status === 404) {
        console.warn(`Asset not found in ASSETS binding: ${assetPath} (requested via ${c.req.path})`);
        return c.notFound();
    }

    console.log(`Asset ${assetPath} found, status: ${response.status}, content-type: ${response.headers.get('Content-Type')}`);
    return response;

  } catch (e) {
    console.error(`Error fetching asset '${assetPath}' via ASSETS binding:`, e);
    return c.text(`Error fetching asset: ${assetPath}. ${e.message}`, 500);
  }
});


// 以前の serveStatic 設定は削除
// app.use(
//   '/assessment/*',
//   serveStatic({
//     root: './public',
//     rewriteRequestPath: (path) => path.replace(/^\/assessment/, '')
//   })
// );


// console.log(); // デバッグ用のログは削除またはコメントアウトを推奨

// --- Worker エントリーポイント ---
export default {
  async fetch(request, env, context) {
    // リクエストURLとパスをログに出力
    console.log(`Incoming request: ${request.method} ${request.url}`);
    const url = new URL(request.url);
    console.log(`Pathname: ${url.pathname}`);
    return app.fetch(request, env, context);
  },
};

// console.log();
