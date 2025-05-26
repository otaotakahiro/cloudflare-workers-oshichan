// タブモジュールをインポート
// import { populateOverviewTab } from './tabs-overview.js'; // 旧 推しデータタブ (性格・運勢タブに統合)
// import { populateSkillsTab } from './tabs-skills.js'; // 削除
// import { populateCareerTab } from './tabs-career.js'; // 削除
// import { populateFutureTab } from './tabs-future.js'; // 削除
// import { populatePlusTab } from './tabs-plus.js'; // 削除
// import { populateLivePerformanceTab } from './tabs-live-performance.js'; // 性格・運勢タブに統合
import { populatePersonalityFortuneTab } from './tabs-personality-fortune.js';
import { populateLoveTendencyTab } from './tabs-love-tendency.js';
import { populateFantasyContentTab } from './tabs-fantasy-content.js';

// インポートの確認用ログ
console.log('タブモジュールのインポート状態:');
// console.log('- populateOverviewTab:', typeof populateOverviewTab === 'function' ? '読み込み成功' : '読み込み失敗');
// console.log('- populateLivePerformanceTab:', typeof populateLivePerformanceTab === 'function' ? '読み込み成功' : '読み込み失敗');
console.log('- populatePersonalityFortuneTab:', typeof populatePersonalityFortuneTab === 'function' ? '読み込み成功' : '読み込み失敗');
console.log('- populateLoveTendencyTab:', typeof populateLoveTendencyTab === 'function' ? '読み込み成功' : '読み込み失敗');
console.log('- populateFantasyContentTab:', typeof populateFantasyContentTab === 'function' ? '読み込み成功' : '読み込み失敗');
// console.log('- populateSkillsTab:', typeof populateSkillsTab === 'function' ? '読み込み成功' : '読み込み失敗'); // 削除
// console.log('- populateCareerTab:', typeof populateCareerTab === 'function' ? '読み込み成功' : '読み込み失敗'); // 削除
// console.log('- populateFutureTab:', typeof populateFutureTab === 'function' ? '読み込み成功' : '読み込み失敗'); // 削除
// console.log('- populatePlusTab:', typeof populatePlusTab === 'function' ? '読み込み成功' : '読み込み失敗'); // 削除

// グローバル変数としてデータを保持
let profileData = null;

// デバッグ情報を処理するための機能（コンソールのみに出力）
function updateDebug(message) {
    // コンソール出力のみにする
    console.log("デバッグ情報:", message);
}

// DOMロード時の処理
document.addEventListener('DOMContentLoaded', function() {
    console.log('ドキュメントロード完了、スクリプト初期化開始');

    // tab-content-containerのパディングを0に設定
    const tabContentContainer = document.querySelector('.tab-content-container');
    if (tabContentContainer) {
        tabContentContainer.style.padding = '0';
        console.log('tab-content-containerのパディングを0に設定しました');
    }

    // HTMLコンテナの存在確認
    console.log('HTMLコンテナの存在確認:');

    const containers = [
        'strengths-list',
        'weaknesses-list',
        'compatibility-container',
        'personality-container',
        'evaluation-container',
        'skills-evaluations-container',
        'interview-questions-container',
        'warning-signals-container',
        'aptitude-container',
        'business-areas-container',
        'success-keywords-container',
        'suitable-fields-container',
        'timeline-container',
        'career-proposals-container',
        'as-boss-container',
        'as-subordinate-container',
        'as-leader-container'
    ];

    containers.forEach(id => {
        const el = document.getElementById(id);
        console.log(`- ${id}:`, el ? '存在します' : '見つかりません');
    });

    // タブ切り替え処理
    initializeTabs();

    // データ読み込み
    loadResultData();

    // スワイプによるタブナビゲーションを初期化
    initializeSwipeNavigation();

    // 「トップに戻る」ボタンの初期化とイベントリスナー設定
    initializeBackToTopButton();

    // スティッキータブ関連の初期化（スクロールとリサイズに対応）
    initializeStickyActiveTab();

    console.log('初期化処理が完了しました');
});

/**
 * タブの初期化と切り替え処理
 */
function initializeTabs() {
    const tabButtons = [
        document.getElementById('personality-fortune-tab'),
        document.getElementById('love-tendency-tab'),
        document.getElementById('fantasy-content-tab')
        // 非表示にしたタブのボタンは含めない
    ].filter(button => button !== null);

    console.log('タブボタン取得状態:', tabButtons.length, '個見つかりました');

    const tabContents = [
        document.getElementById('personality-fortune-content'),
        document.getElementById('love-tendency-content'),
        document.getElementById('fantasy-content-content')
        // 非表示にしたタブのコンテンツは含めない
    ].filter(content => content !== null);

    console.log('タブコンテンツ取得状態:', tabContents.length, '個見つかりました');

    if (tabButtons.length === 0) {
        console.error('タブボタンが見つかりませんでした。HTMLを確認してください。');
        return;
    }

    tabButtons.forEach((button) => {
        const baseId = button.id.replace('-tab', '');
        const tabId = `${baseId}-content`;

        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            this.classList.add('active');
            const contentElement = document.getElementById(tabId);
            if (contentElement) {
                contentElement.classList.add('active');
            } else {
                console.error(`対応するタブコンテンツが見つかりません: ${tabId}`);
            }
        });
    });

    if (tabButtons.length > 0) {
        tabButtons[0].click();
    }
}

/**
 * エラーメッセージの表示
 */
function showError(message) {
    console.error('エラーメッセージを表示:', message);

    // エラーメッセージのHTML要素がある場合はそのテキストを設定して表示
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        console.log('エラー要素が見つかりました');
        // エラーテキスト要素を探す
        const errorTextElement = document.getElementById('error-text');
        if (errorTextElement) {
            errorTextElement.textContent = message;
        } else {
            errorElement.innerHTML = `<p>${message}</p>`;
        }
        errorElement.classList.remove('hidden');
    } else {
        // エラー要素がない場合はアラートを表示
        alert(`エラー: ${message}`);
    }
}

/**
 * URLからIDとフォームデータを取得し、結果データを読み込む
 */
async function loadResultData() {
    const urlParams = new URLSearchParams(window.location.search);
    const resultId = urlParams.get('id');
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.classList.add('hidden');

    try {
        const response = await fetch(`/api/results/${resultId}`);
        if (!response.ok) {
            const errorBody = await response.text();
            showError(`データの読み込みに失敗しました。ステータス: ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
        }

        const apiResponse = await response.json();
        console.log('API Response received:', JSON.stringify(apiResponse, null, 2));

        if (!apiResponse || !apiResponse.result || !apiResponse.result.base || !apiResponse.result.base.baseDiagnosis) {
            console.error('APIレスポンスの構造が不正です。診断データが見つかりません。', apiResponse);
            showError('診断データの形式が正しくありません。');
            throw new Error('Invalid API response structure: base.baseDiagnosis not found.');
        }

        const diagnosisResult = apiResponse.result.base.baseDiagnosis; // OpenAIからの診断結果オブジェクト
        const formData = apiResponse.result.formData; // フォーム入力データ

        console.log('Parsed diagnosisResult:', JSON.stringify(diagnosisResult, null, 2));
        console.log('Parsed formData:', JSON.stringify(formData, null, 2));

        updateProfileInfo(formData, diagnosisResult); // formDataと診断結果全体を渡す
        populateAllTabs(diagnosisResult); // 診断結果オブジェクト全体を渡す

    } catch (error) {
        console.error('Error loading result data:', error);
        showError(`データの読み込み中にエラーが発生しました: ${error.message}`);
    }
}

/**
 * プロファイル情報（ヘッダー部分）を更新
 * @param {Object} formData - フォーム入力データ
 * @param {Object} diagnosisData - OpenAIからの診断結果オブジェクト全体
 */
function updateProfileInfo(formData, diagnosisData) {
    let oshiFullName = '推し';
    let oshiGender = '-';
    let oshiBirthDate = '-';

    if (formData) {
        if (formData.familyName && formData.firstName) {
            oshiFullName = `${formData.familyName} ${formData.firstName}`.trim();
        } else if (formData.name) { // フォールバックとしてnameキーも見る
            oshiFullName = formData.name.trim();
        }
        if (formData.gender) {
            const genderMap = {
                male: '男性',
                female: '女性',
                other: 'その他',
                prefer_not_to_say: '回答しない'
            };
            oshiGender = genderMap[formData.gender.toLowerCase()] || formData.gender;
        }
        if (formData.birthdate) {
            try {
                const date = new Date(formData.birthdate + 'T00:00:00');
                if (!isNaN(date)) {
                    oshiBirthDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
                }
            } catch (e) {
                console.warn('生年月日の日付形式が無効です:', formData.birthdate, e);
                oshiBirthDate = formData.birthdate;
            }
        }
    }

    // formDataに名前情報がない場合、diagnosisDataのpublicPersonaから推測 (これは補助的なので無くても良い)
    if (oshiFullName === '推し' && diagnosisData && diagnosisData.publicPersona) {
        const match = diagnosisData.publicPersona.match(/^(.*?)(は|のステージ)/);
        if (match && match[1]) {
            oshiFullName = match[1].trim();
        }
    }

    const oshiNamePlaceholder = document.getElementById('oshi-name-placeholder');
    if (oshiNamePlaceholder) oshiNamePlaceholder.textContent = oshiFullName;
    const fullNameElement = document.getElementById('full-name');
    if (fullNameElement) fullNameElement.textContent = oshiFullName;
    const genderElement = document.getElementById('gender');
    if (genderElement) genderElement.textContent = oshiGender;
    const birthDateElement = document.getElementById('birth-date');
    if (birthDateElement) birthDateElement.textContent = oshiBirthDate;

    const analysisDateElement = document.getElementById('analysis-date');
    if (analysisDateElement) {
        const now = new Date();
        analysisDateElement.textContent = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
    }
}

/**
 * 全タブのデータを設定
 * @param {Object} diagnosisData - OpenAIからの診断結果オブジェクト全体
 */
function populateAllTabs(diagnosisData) {
    console.log('全タブのデータを設定します。受け取ったデータ:', diagnosisData);

    if (!diagnosisData) {
        console.error('診断データがないため、タブデータを設定できません');
        showError('表示する診断データがありません。');
        return;
    }

    try {
        // 性格・運勢タブ (baseDiagnosisの主要項目 + importantThingsInLifeTop3, currentFortune, futureTurningPoint, livePerformanceHints)
        // populatePersonalityFortuneTab は diagnosisData (baseDiagnosis全体) を受け取るように設計されている
        if (diagnosisData) { // diagnosisData自体がbaseDiagnosisオブジェクト
            populatePersonalityFortuneTab(diagnosisData);
            console.log('性格・運勢タブを設定...');
        } else {
            console.warn('性格・運勢タブのデータ(diagnosisData全体)が見つかりません。');
            const pfContent = document.getElementById('personality-fortune-content');
            if (pfContent) pfContent.innerHTML = '<div class="p-4 text-gray-500">性格・運勢データが見つかりませんでした。</div>';
        }

        // 恋愛傾向タブ
        if (diagnosisData.loveTendency) {
            populateLoveTendencyTab(diagnosisData.loveTendency);
            console.log('恋愛傾向タブを設定...');
        } else {
            console.warn('loveTendency データが見つかりません。');
            const ltContent = document.getElementById('love-tendency-content');
            if (ltContent) ltContent.innerHTML = '<div class="p-4 text-gray-500">恋愛傾向データが見つかりませんでした。</div>';
        }

        // 妄想コンテンツタブ
        if (diagnosisData.fantasyContent) {
            populateFantasyContentTab(diagnosisData.fantasyContent);
            console.log('妄想コンテンツタブを設定...');
        } else {
            console.warn('fantasyContent データが見つかりません。');
            const fcContent = document.getElementById('fantasy-content-content');
            if (fcContent) fcContent.innerHTML = '<div class="p-4 text-gray-500">妄想コンテンツデータが見つかりませんでした。</div>';
        }

        console.log('全タブのデータ設定が完了しました');
    } catch (error) {
        console.error('タブデータの設定中にエラーが発生しました:', error);
        showError('データの表示中にエラーが発生しました: ' + error.message);
    }
}

/**
 * ローディングインジケータの表示/非表示
 */
// function showLoadingIndicator(show) {
//   const loadingIndicator = document.getElementById('loading-indicator');
//   if (loadingIndicator) {
//     loadingIndicator.style.display = show ? 'block' : 'none';
//   }
// }

/**
 * APIデータ構造を診断するヘルパー関数
 * @param {Object} data - 分析するAPIレスポンスデータ
 * @return {string} 診断結果のメッセージ
 */
function diagnoseApiStructure(data) {
    if (!data) {
        return "APIデータが空です";
    }

    let msg = [];
    msg.push("APIデータ構造診断:");

    // result確認
    if (!data.result) {
        msg.push("- result属性が存在しません！");
        return msg.join("\n");
    }

    // 新API構造チェック
    if (data.result.data && data.result.status) {
        msg.push("- 新API構造を検出（result.data + result.status）");

        const source = data.result.data;
        // 各セクションの存在確認
        ['overview', 'skills', 'career', 'future', 'plus'].forEach(section => {
            if (source[section]) {
                msg.push(`- ${section}セクション: 存在`);

                // 特定のキーのチェック
                if (section === 'overview') {
                    checkKeys(source[section], ['strengths', 'weaknesses', 'compatibility', 'personality', 'evaluation'], msg, section);
                } else if (section === 'skills') {
                    checkKeys(source[section], ['evaluations', 'interviewQuestions', 'warningSignals'], msg, section);
                } else if (section === 'career') {
                    checkKeys(source[section], ['aptitudeScores', 'businessAreas', 'successKeywords', 'suitableFields'], msg, section);
                } else if (section === 'future') {
                    checkKeys(source[section], ['timeline', 'careerProposals'], msg, section);
                } else if (section === 'plus') {
                    checkKeys(source[section], ['asBoss', 'asSubordinate', 'asLeader'], msg, section);
                }

                // 入れ子構造のチェック
                if (source[section][section]) {
                    msg.push(`  - 入れ子構造: ${section}.${section}が存在`);
                }

                // dataサブオブジェクトのチェック
                if (source[section].data) {
                    msg.push(`  - ${section}.dataサブオブジェクトが存在`);
                }
            } else {
                msg.push(`- ${section}セクション: 存在しません！`);
            }
        });

        // ユーザー情報のチェック
        if (source.userInfo) {
            msg.push("- userInfo: 存在");
        }
    }
    // 従来のAPI構造チェック
    else {
        msg.push("- 従来のAPI構造を検出");

        // 基本情報のチェック
        checkKeys(data.result, ['name', 'birthDate', 'gender', 'analysisDate'], msg, 'result');

        // 各タブセクションのチェック
        ['overview', 'skills', 'career', 'future', 'plus'].forEach(section => {
            if (data.result[section]) {
                msg.push(`- ${section}セクション: 存在`);
            } else {
                msg.push(`- ${section}セクション: 存在しません！`);
            }
        });
    }

    return msg.join("\n");
}

/**
 * オブジェクト内の特定のキーの存在を確認する
 * @param {Object} obj - チェック対象のオブジェクト
 * @param {Array<string>} keys - 確認するキーの配列
 * @param {Array<string>} messages - メッセージを追加する配列
 * @param {string} section - セクション名
 */
function checkKeys(obj, keys, messages, section) {
    keys.forEach(key => {
        if (obj[key]) {
            let info = `  - ${key}: 存在`;
            if (Array.isArray(obj[key])) {
                info += ` (${obj[key].length}件)`;
            }
            messages.push(info);
        } else {
            messages.push(`  - ${key}: 存在しません！`);
        }
    });
}

// グローバルスコープから診断関数を実行するためのヘルパー
window.diagnoseCurrentApiData = function() {
    try {
        const lastApiResponse = localStorage.getItem('last_api_response');
        if (lastApiResponse) {
            const data = JSON.parse(lastApiResponse);
            const diagnosisResult = diagnoseApiStructure({result: data});
            console.log(diagnosisResult);
            alert(diagnosisResult);
            return diagnosisResult;
        } else {
            alert("ローカルストレージにAPIレスポンスがありません");
            return "ローカルストレージにAPIレスポンスがありません";
        }
    } catch (e) {
        console.error("診断中にエラーが発生しました:", e);
        alert("診断中にエラーが発生しました: " + e.message);
        return "エラー: " + e.message;
    }
};

/**
 * スワイプによるタブナビゲーションを初期化
 */
function initializeSwipeNavigation() {
    const tabContainer = document.querySelector('.tab-content-container');
    if (!tabContainer) {
        console.error('Tab content container not found for swipe navigation.');
        return;
    }

    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    const swipeThreshold = 50; // Minimum distance for a swipe
    const verticalThreshold = 75; // Max vertical distance to allow swipe

    tabContainer.addEventListener('touchstart', (event) => {
        // Ignore if touching interactive elements like buttons or links inside tabs
        if (event.target.closest('button, a')) {
            return;
        }
        touchStartX = event.changedTouches[0].screenX;
        touchStartY = event.changedTouches[0].screenY;
    }, { passive: true });

    tabContainer.addEventListener('touchend', (event) => {
        if (event.target.closest('button, a')) {
            return;
        }
        touchEndX = event.changedTouches[0].screenX;
        touchEndY = event.changedTouches[0].screenY;
        handleSwipeGesture();
    }, { passive: true });

    function handleSwipeGesture() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Only handle horizontal swipes, ignore if vertical scroll is significant
        if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaY) < verticalThreshold) {
            const tabButtons = Array.from(document.querySelectorAll('.tab-button'));
            const currentActiveIndex = tabButtons.findIndex(button => button.classList.contains('active'));

            if (currentActiveIndex === -1) return; // No active tab found

            let nextIndex;
            if (deltaX < 0) {
                // Swipe Left (Next Tab)
                nextIndex = (currentActiveIndex + 1) % tabButtons.length;
            } else {
                // Swipe Right (Previous Tab)
                nextIndex = (currentActiveIndex - 1 + tabButtons.length) % tabButtons.length;
            }

            console.log(`Swipe detected. Current: ${currentActiveIndex}, Next: ${nextIndex}`);
            if (tabButtons[nextIndex]) {
                tabButtons[nextIndex].click(); // Simulate click on the next/previous tab
            }
        }
    }

    console.log('Swipe navigation initialized.');
}

/**
 * 「トップに戻る」ボタンの初期化とイベントリスナー設定
 */
function initializeBackToTopButton() {
    const btn = document.getElementById('back-to-top-btn');
    if (!btn) {
        console.error('Back to top button not found.');
        return;
    }

    // スクロールイベントリスナー
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // スクロール可能な高さが存在する場合のみ計算
        const scrollableHeight = scrollHeight - clientHeight;
        if (scrollableHeight <= 0) {
            btn.classList.add('hidden');
            return;
        }

        const scrollPercent = (scrollTop / scrollableHeight) * 100;

        if (scrollPercent >= 35) { // 35%スクロールしたら表示
            btn.classList.remove('hidden');
        } else {
            btn.classList.add('hidden');
        }
    }, { passive: true }); // Performance optimization

    // クリックイベントリスナー
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // スムーズスクロール
        });
    });

    console.log('Back to Top button initialized.');
}

/**
 * スティッキータブ関連の初期化（スクロールとリサイズに対応）
 */
function initializeStickyActiveTab() {
    // スクロールイベントリスナーを追加
    window.addEventListener('scroll', handleStickyActiveTabVisibility, { passive: true });
    // リサイズイベントリスナーを追加
    window.addEventListener('resize', handleStickyActiveTabVisibility, { passive: true }); // passiveはresizeでは不要かもですが念のため

    // 初期表示状態を設定
    handleStickyActiveTabVisibility();
    console.log('Sticky active tab handler initialized for scroll and resize.');
}

/**
 * スクロール位置と画面幅に基づいてタブの表示/非表示を切り替える (改修版)
 */
function handleStickyActiveTabVisibility() {
    const tabButtonContainer = document.querySelector(".header-section .inline-flex");
    const header = document.querySelector(".header-section");

    if (!tabButtonContainer || !header) {
        return;
    }

    const tabButtons = tabButtonContainer.querySelectorAll(".tab-button");
    const scrollY = window.scrollY;
    const threshold = 5;
    const screenWidth = window.innerWidth;
    const breakpoint = 768;

    if (screenWidth < breakpoint) {
        if (scrollY > threshold) {
            tabButtons.forEach(button => {
                const isActive = button.classList.contains('active');
                if (!isActive) {
                    button.style.display = 'none';
                } else {
                    button.style.display = '';
                }
            });
        } else {
            tabButtons.forEach(button => {
                button.style.display = '';
            });
        }
    } else {
        tabButtons.forEach(button => {
            button.style.display = '';
        });
    }
}
