import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import assessmentRoute from './routes/assessment.route';

const app = new Hono();

// HTML content with loading overlay
const formHtml = `
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>おしちゃん｜推しとの相性診断｜公式サイト</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@300;400;500;700&display=swap">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
    <style>
        :root {
            --main-bg-color: #f8f5fa; /* 淡い白色の背景 */
            --main-text-color: #333333;
            --accent-color: #9370DB;
            --light-accent: #b19cd9;
            --form-bg-color: rgba(255, 255, 255, 0.85);
            --form-border: rgba(147, 112, 219, 0.5);
        }

        body {
            font-family: 'Zen Maru Gothic', sans-serif;
            background-color: var(--main-bg-color);
            color: var(--main-text-color);
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            position: relative;
            min-height: 100vh;
        }

        .container-custom { /* Tailwindの.containerと区別するため変更 */
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            position: relative;
            z-index: 2;
        }

        h1.site-title { /* 既存のmain-titleとの衝突を避ける */
            font-size: 3rem;
            text-align: center;
            margin-bottom: 0.5rem;
            background: linear-gradient(45deg, #9370DB, #b19cd9, #d8bfd8);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 0 10px rgba(147, 112, 219, 0.3);
            animation: shimmer 2s infinite alternate;
        }

        @keyframes shimmer {
            0% { text-shadow: 0 0 5px rgba(147, 112, 219, 0.3); }
            100% { text-shadow: 0 0 15px rgba(147, 112, 219, 0.7); }
        }

        .subtitle {
            text-align: center;
            font-size: 1.2rem;
            margin-bottom: 2rem;
            color: var(--accent-color);
        }

        .form-container {
            background-color: var(--form-bg-color);
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            position: relative;
            border: 1px solid var(--form-border);
            overflow: hidden;
        }

        .form-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
            background: linear-gradient(to right, #b19cd9, #9370DB, #d8bfd8);
            border-top-left-radius: 15px;
            border-top-right-radius: 15px;
        }

        .form-row {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
            color: var(--accent-color);
        }

        input, select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
            color: #333;
            transition: all 0.3s;
            background-color: white; /* 背景色を明示 */
        }

        input:focus, select:focus {
            border-color: var(--accent-color);
            outline: none;
            box-shadow: 0 0 5px rgba(147, 112, 219, 0.5);
        }

        .btn-submit {
            display: block;
            width: 100%;
            padding: 12px;
            background: linear-gradient(45deg, #9370DB, #b19cd9);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .btn-submit:hover {
            background: linear-gradient(45deg, #8560cb, #a08cd9);
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(147, 112, 219, 0.4);
        }

        .btn-submit::before {
            content: "★";
            position: absolute;
            font-size: 1.5rem;
            left: 15px;
            opacity: 0;
            transition: all 0.3s;
        }

        .btn-submit::after {
            content: "★";
            position: absolute;
            font-size: 1.5rem;
            right: 15px;
            opacity: 0;
            transition: all 0.3s;
        }

        .btn-submit:hover::before, .btn-submit:hover::after {
            opacity: 1;
        }

        .decoration {
            position: absolute;
            z-index: 1;
            opacity: 0.7;
            pointer-events: none;
        }

        .feather {
            position: absolute;
            width: 30px;
            height: 100px;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%239370DB" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24c-5.23-5.47-13.21-5.37-18.36-.18L12 22.76l10.88-10.52z"></path></svg>');
            background-size: contain;
            background-repeat: no-repeat;
            animation: float 15s infinite ease-in-out;
            opacity: 0.6;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-20px) rotate(-5deg); }
            50% { transform: translateY(-10px) rotate(5deg); }
            75% { transform: translateY(-25px) rotate(-3deg); }
        }

        .star {
            position: absolute;
            width: 20px;
            height: 20px;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239370DB" stroke="%239370DB" stroke-width="0.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>');
            background-size: contain;
            background-repeat: no-repeat;
            animation: twinkle 4s infinite ease-in-out;
        }

        @keyframes twinkle {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
        }

        .heart {
            position: absolute;
            width: 25px;
            height: 25px;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ffc0cb" stroke="%23ffc0cb" stroke-width="0.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>');
            background-size: contain;
            background-repeat: no-repeat;
            animation: pulse 3s infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        .dot-pattern {
            position: absolute;
            width: 200px;
            height: 200px;
            background-image: radial-gradient(circle, var(--light-accent) 1px, transparent 1px);
            background-size: 15px 15px;
            opacity: 0.2;
            border-radius: 50%;
        }

        .lace {
            position: absolute;
            width: 100%;
            height: 50px;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 25" fill="%239370DB" opacity="0.3"><path d="M0,20 Q25,5 50,20 T100,20 L100,25 L0,25 Z"></path></svg>');
            background-repeat: repeat-x;
            background-size: 100px 25px;
            opacity: 0.3;
        }

        .sparkle {
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: white;
            box-shadow: 0 0 10px 2px var(--light-accent);
            animation: sparkle_anim 3s infinite; /* アニメーション名変更 */
        }

        @keyframes sparkle_anim { /* アニメーション名変更 */
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
        }

        @media (max-width: 640px) {
            h1.site-title {
                font-size: 2.2rem;
            }

            .form-container {
                padding: 20px;
            }

            .form-row {
                margin-bottom: 15px;
            }
        }

        #particles-js {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
        }

        /* Loading Overlay Style */
        #loading-overlay { /* 基本スタイル */
          position: fixed;
          inset: 0;
          background-color: rgba(248, 245, 250, 0.85); /* var(--main-bg-color) に近い半透明 */
          z-index: 9999; /* particles-js より手前、コンテンツより手前 */
          /* display: flex; を削除。下の :not(.hidden) で制御 */
        }
        #loading-overlay:not(.hidden) { /* hiddenクラスがない場合に表示スタイルを適用 */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        /* hiddenクラスはTailwind CSSが display: none !important; を提供することを期待 */

        #loading-overlay .spinner {
          width: 64px; /* Tailwindのh-16 w-16相当 */
          height: 64px;
          border-top-width: 4px;
          border-bottom-width: 4px;
          border-color: var(--accent-color); /* var(--accent-color) */
          animation: spin 1s linear infinite;
          border-radius: 50%;
          border-style: solid;
          border-left-color: transparent; /* スピナーらしく一部透明に */
          border-right-color: transparent;
        }
        #loading-overlay p {
          color: var(--accent-color);
          font-size: 1.25rem; /* Tailwindのtext-xl相当 */
          margin-top: 1rem;
          font-weight: 500;
        }
    </style>
  </head>
  <body>
    <!-- Loading Overlay -->
    <div id="loading-overlay" class="hidden"> <!-- 初期状態はhidden -->
      <div class="spinner"></div>
      <p>分析中です...</p>
    </div>

    <div id="particles-js"></div>

    <div class="decoration feather" style="top: 10%; left: 5%;"></div>
    <div class="decoration feather" style="top: 15%; right: 10%;"></div>
    <div class="decoration feather" style="top: 40%; left: 15%;"></div>
    <div class="decoration feather" style="bottom: 20%; right: 5%;"></div>

    <div class="decoration star" style="top: 20%; left: 20%;"></div>
    <div class="decoration star" style="top: 15%; right: 25%;"></div>
    <div class="decoration star" style="bottom: 30%; left: 10%;"></div>
    <div class="decoration star" style="bottom: 15%; right: 15%;"></div>

    <div class="decoration heart" style="top: 25%; right: 10%;"></div>
    <div class="decoration heart" style="bottom: 25%; left: 15%;"></div>

    <div class="decoration dot-pattern" style="top: -100px; right: -50px;"></div>
    <div class="decoration dot-pattern" style="bottom: -100px; left: -50px;"></div>

    <div class="lace" style="bottom: 0; left: 0;"></div>
    <div class="lace" style="top: 0; left: 0; transform: rotate(180deg);"></div>

    <div class="decoration sparkle" style="top: 15%; left: 30%;"></div>
    <div class="decoration sparkle" style="top: 25%; right: 20%;"></div>
    <div class="decoration sparkle" style="bottom: 30%; left: 40%;"></div>
    <div class="decoration sparkle" style="bottom: 10%; right: 35%;"></div>

    <div class="container-custom"> <!-- class名変更 -->
        <div class="animate__animated animate__fadeIn">
            <h1 class="site-title">おしちゃん</h1> <!-- class名変更 -->
            <p class="subtitle">あなたの推しとの相性を診断します♡</p>

            <div class="form-container">
                <form id="oshi-form" onsubmit="submitForm(event)"> <!-- onsubmit を既存の関数に -->
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="form-row">
                            <label for="familyName">推しの名前（姓）</label> <!-- name属性を修正 -->
                            <input type="text" id="familyName" name="familyName" placeholder="例：佐藤" required value="クォン">
                        </div>

                        <div class="form-row">
                            <label for="firstName">推しの名前（名）</label> <!-- name属性を修正 -->
                            <input type="text" id="firstName" name="firstName" placeholder="例：太郎" required value="ジヨン">
                        </div>

                        <div class="form-row">
                            <label for="familyNameKana">推しの名前（姓ふりがな）</label> <!-- name属性を修正 -->
                            <input type="text" id="familyNameKana" name="familyNameKana" placeholder="例：さとう" required value="クォン">
          </div>

                        <div class="form-row">
                            <label for="firstNameKana">推しの名前（名ふりがな）</label> <!-- name属性を修正 -->
                            <input type="text" id="firstNameKana" name="firstNameKana" placeholder="例：たろう" required value="ジヨン">
          </div>
        </div>

                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="form-row">
                            <label for="birthdate">推しの誕生日</label> <!-- name属性を修正 -->
                            <input type="date" id="birthdate" name="birthdate" required value="1988-08-18">
          </div>

                        <div class="form-row">
                            <label for="gender">推しの性別</label>
                            <select id="gender" name="gender" required>
                                <option value="" disabled>選択してください</option>
                                <option value="male" selected>男性</option>
                                <option value="female">女性</option>
                                <option value="other">その他</option>
                            </select>
          </div>
        </div>

                    <div class="mt-6">
                        <button type="submit" class="btn-submit">診断スタート</button>
        </div>
                </form>
          </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
    <script>
        // 既存のsubmitForm関数をここに移動・統合
      async function submitForm(event) {
        event.preventDefault();
        const submitButton = document.querySelector('button[type="submit"]');
        const loadingOverlay = document.getElementById('loading-overlay');

        loadingOverlay.classList.remove('hidden');
          submitButton.disabled = true;

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
              window.location.href = '/result-tabs.html?id=' + result.resultId;
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error || '分析に失敗しました');
          }
        } catch (error) {
            alert(error.message); // シンプルなalertでエラー表示
          loadingOverlay.classList.add('hidden');
            submitButton.disabled = false;
          }
        }

        // パーティクル設定
        particlesJS("particles-js", {
            particles: {
                number: { value: 50, density: { enable: true, value_area: 800 } },
                color: { value: "#9370db" },
                shape: { type: ["circle", "star"], stroke: { width: 0, color: "#000000" } },
                opacity: { value: 0.3, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
                size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1, sync: false } },
                line_linked: { enable: true, distance: 150, color: "#b19cd9", opacity: 0.2, width: 1 },
                move: { enable: true, speed: 1, direction: "none", random: true, straight: false, out_mode: "out", bounce: false }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "bubble" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                },
                modes: {
                    bubble: { distance: 150, size: 6, duration: 2, opacity: 0.8, speed: 3 },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });

        document.addEventListener("DOMContentLoaded", function() {
            for (let i = 0; i < 10; i++) {
                createFloatingFeather();
            }
            // フォーム送信イベントはsubmitForm関数で処理するので、ここでの重複リスナーは不要
        });

        function createFloatingFeather() {
            const feather = document.createElement('div');
            feather.classList.add('decoration', 'feather');
            feather.style.top = Math.random() * 100 + '%';
            feather.style.left = Math.random() * 100 + '%';
            feather.style.opacity = 0.3 + Math.random() * 0.4;
            feather.style.transform = \`scale(\${0.5 + Math.random()}) rotate(\${Math.random() * 360}deg)\`;
            feather.style.animationDuration = 10 + Math.random() * 20 + 's';
            feather.style.animationDelay = Math.random() * 5 + 's';
            document.body.appendChild(feather);
      }
    </script>

    <footer class="text-center py-8 text-sm text-gray-500" style="background-color: var(--main-bg-color); z-index: 2; position: relative;">
      <p class="mb-2">この診断はあなたの推しへのアイを深めるエンターテイメントです</p>
      <p id="footer-text"></p>
    </footer>
    <script>
      document.getElementById('footer-text').innerHTML = \`&copy; \${new Date().getFullYear()} TeN Co., Ltd. All Rights Reserved.\`;
    </script>
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

// APIルート
app.route('/api/results', assessmentRoute(app));

// 静的ファイル配信 (public ディレクトリをルートとする)
// 重要: APIルートなど、より具体的なルートの後に配置する
app.use('/*', serveStatic({ root: './public' }));

// --- Worker エントリーポイント ---
export default {
  async fetch(request, env, context) {
    return app.fetch(request, env, context);
  },
};

// console.log();
