import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import resultsRoute from './routes/results.route';

const app = new Hono();

// HTML content with loading overlay
const formHtml = `
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HR プロファイリング</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
    <link href="/styles/main.css" rel="stylesheet" />
  </head>
  <body>
    <!-- Loading Overlay -->
    <div id="loading-overlay" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex flex-col items-center justify-center z-50 hidden">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4"></div>
      <p class="text-white text-xl">分析中です...</p>
    </div>

    <div class="container">
      <h1 class="main-title">HR プロファイリング</h1>
      <form onsubmit="submitForm(event)" class="max-w-lg mx-auto">
        <div class="mb-4 flex gap-4">
          <div class="w-1/2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="familyName"> 姓（漢字） </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="familyName"
              name="familyName"
              type="text"
              required
              value="山田"
            />
          </div>
          <div class="w-1/2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="firstName"> 名（漢字） </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="firstName"
              name="firstName"
              type="text"
              required
              value="太郎"
            />
          </div>
        </div>
        <div class="mb-4 flex gap-4">
          <div class="w-1/2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="familyNameKana"> 姓（ふりがな） </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="familyNameKana"
              name="familyNameKana"
              type="text"
              required
              value="やまだ"
            />
          </div>
          <div class="w-1/2">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="firstNameKana"> 名（ふりがな） </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="firstNameKana"
              name="firstNameKana"
              type="text"
              required
              value="たろう"
            />
          </div>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="birthdate"> 生年月日 </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="birthdate"
            name="birthdate"
            type="date"
            required
            value="1992-02-14"
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2"> 性別 </label>
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
          const response = await fetch('/api/results', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const result = await response.json();
            // Redirect to results page - loading overlay will disappear on navigation
            window.location.href = '/result-tabs.html?id=' + result.id;
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
      <p>© 2025 HR Profiling</p>
    </footer>
  </body>
</html>
`;

// --- Hono アプリケーション ---
// ルートパス (".env") - 404 Not Found を返す
// app.get('/', (c) => {
//   return c.notFound();
// }); // このルートを削除

// フォーム表示 (GET /oatoorihakat)
app.get('/oatoorihakat', (c) => {
  return c.html(formHtml);
});

// 既存のAPIルート
app.route('/api/results', resultsRoute(app));

// 静的ファイル配信 (public ディレクトリをルートとする)
// 重要: APIルートなど、より具体的なルートの後に配置する
app.use('/*', serveStatic({ root: './public' }));

// --- Worker エントリーポイント ---
export default {
  async fetch(request, env, context) {
    return app.fetch(request, env, context);
  },
};
