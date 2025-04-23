// タブモジュールをインポート
import { populateOverviewTab } from './tabs-overview.js';
import { populateSkillsTab } from './tabs-skills.js';
import { populateCareerTab } from './tabs-career.js';
import { populateFutureTab } from './tabs-future.js';
import { populatePlusTab } from './tabs-plus.js';

// インポートの確認用ログ
console.log('タブモジュールのインポート状態:');
console.log('- populateOverviewTab:', typeof populateOverviewTab === 'function' ? '読み込み成功' : '読み込み失敗');
console.log('- populateSkillsTab:', typeof populateSkillsTab === 'function' ? '読み込み成功' : '読み込み失敗');
console.log('- populateCareerTab:', typeof populateCareerTab === 'function' ? '読み込み成功' : '読み込み失敗');
console.log('- populateFutureTab:', typeof populateFutureTab === 'function' ? '読み込み成功' : '読み込み失敗');
console.log('- populatePlusTab:', typeof populatePlusTab === 'function' ? '読み込み成功' : '読み込み失敗');

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
    // 新しく追加されたid属性に基づいてタブボタンを選択
    const tabButtons = [
        document.getElementById('overview-tab'),
        document.getElementById('skills-tab'),
        document.getElementById('career-tab'),
        document.getElementById('future-tab'),
        document.getElementById('plus-tab')
    ].filter(button => button !== null); // nullの要素を除外

    console.log('タブボタン取得状態:', tabButtons.length, '個見つかりました');

    // タブコンテンツ要素を取得
    const tabContents = [
        document.getElementById('overview-content'),
        document.getElementById('skills-content'),
        document.getElementById('career-content'),
        document.getElementById('future-content'),
        document.getElementById('plus-content')
    ].filter(content => content !== null);

    console.log('タブコンテンツ取得状態:', tabContents.length, '個見つかりました');

    // ボタンが見つからない場合は処理を終了
    if (tabButtons.length === 0) {
        console.error('タブボタンが見つかりませんでした。HTMLを確認してください。');
        return;
    }

    // 各タブボタンにクリックイベントを設定
    tabButtons.forEach((button, index) => {
        // ID名からタブIDを抽出（例: overview-tab → overview-content）
        const baseId = button.id.replace('-tab', '');
        const tabId = `${baseId}-content`;

        console.log(`タブ設定: ${button.id} → ${tabId}`);

        button.addEventListener('click', function() {
            console.log(`タブクリック: ${this.id} → ${tabId}`);

            // すべてのタブからアクティブクラスを削除
            tabButtons.forEach(btn => {
                if (btn) btn.classList.remove('active');
            });

            // すべてのコンテンツからアクティブクラスを削除
            tabContents.forEach(content => {
                if (content) content.classList.remove('active');
            });

            // クリックされたタブとそれに対応するコンテンツをアクティブにする
            this.classList.add('active');
            const contentElement = document.getElementById(tabId);
            if (contentElement) {
                contentElement.classList.add('active');
            } else {
                console.error(`対応するタブコンテンツが見つかりません: ${tabId}`);
            }
        });
    });

    // 初期状態として最初のタブをアクティブに設定
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
    // const loadingIndicator = document.getElementById('loading-indicator'); // コメントアウト済み
    const errorMessageDiv = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    // ローディング表示を開始
    // if (loadingIndicator) loadingIndicator.style.display = 'block'; // コメントアウト済み
    errorMessageDiv.classList.add('hidden');

    // デバッグログの追加
    updateDebug(`loadResultData 開始: resultId=${resultId}`); // isTestMode を削除

    try {
        // 通常モードの場合：APIからデータをフェッチ
        updateDebug('APIからデータをフェッチします');
        const response = await fetch(`/api/results/${resultId}`);
        updateDebug(`API レスポンスステータス: ${response.status}`);

        if (!response.ok) {
            const errorBody = await response.text(); // エラー内容を取得
            updateDebug(`API エラーレスポンス: ${errorBody}`);
            showError(`データの読み込みに失敗しました。ステータス: ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        profileData = await response.json(); // グローバル変数にデータを格納
        updateDebug('API データ取得成功');

        // 取得したデータ構造の検証（デバッグ用）
        diagnoseApiStructure(profileData);

        // ローディング非表示
        // if (loadingIndicator) loadingIndicator.style.display = 'none'; // コメントアウト済み

        // プロファイル情報を更新
        updateProfileInfo(profileData);

        // すべてのタブの内容を描画
        populateAllTabs();

    } catch (error) {
        console.error('Error loading result data:', error);
        updateDebug(`エラー発生: ${error.message}`);
        // エラー時もローディングを非表示
        // if (loadingIndicator) loadingIndicator.style.display = 'none'; // コメントアウト済み
        showError(`データの読み込み中にエラーが発生しました: ${error.message}`);
    }
}

/**
 * プロファイル情報（ヘッダー部分）を更新
 * @param {Object} userInfo - ユーザー情報オブジェクト
 */
function updateProfileInfo(userInfo) {
    if (!userInfo) {
        console.error('updateProfileInfo: userInfoがnullまたはundefinedです');
        return;
    }

    // 姓名を取得
    const familyName = userInfo.familyName || '';
    const firstName = userInfo.firstName || '';
    // nameを優先的に使用し、ない場合は姓名から生成
    const fullName = userInfo.name || `${familyName} ${firstName}`.trim();

    console.log('プロファイル情報更新詳細:', {
        familyName,
        firstName,
        fullName,
        birthDate: userInfo.birthDate,
        gender: userInfo.gender,
        analysisDate: userInfo.analysisDate
    });

    // ヘッダー情報を更新
    const nameElement = document.getElementById('person-name');
    if (nameElement) {
        // タイトルは「総合プロファイリング」のみを表示
        nameElement.textContent = '総合プロファイリング';
        console.log('タイトルを更新しました:', nameElement.textContent);
    } else {
        console.error('person-name要素が見つかりません');
    }

    // 氏名欄を更新
    const fullNameElement = document.getElementById('full-name');
    if (fullNameElement) {
        fullNameElement.textContent = fullName || '';
        console.log('氏名要素を更新しました:', fullNameElement.textContent);
    } else {
        console.error('full-name要素が見つかりません');
    }

    // 生年月日欄を更新
    const birthElement = document.getElementById('birth-date');
    if (birthElement) {
        birthElement.textContent = userInfo.birthDate || '';
        console.log('生年月日要素を更新しました:', birthElement.textContent);
    } else {
        console.error('birth-date要素が見つかりません');
    }

    // 性別欄を更新
    const genderElement = document.getElementById('gender');
    if (genderElement) {
        // 性別の表示形式を調整
        let displayGender = userInfo.gender || '';
        if (displayGender === 'male') {
            displayGender = '男性';
        } else if (displayGender === 'female') {
            displayGender = '女性';
        }
        genderElement.textContent = displayGender;
        console.log('性別要素を更新しました:', genderElement.textContent);
    } else {
        console.error('gender要素が見つかりません');
    }

    // 分析日欄を更新
    const analysisElement = document.getElementById('analysis-date');
    if (analysisElement) {
        // 常に年月日形式で表示
        let analysisDate = userInfo.analysisDate || '';
        if (!analysisDate) {
            const now = new Date();
            analysisDate = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
        } else if (!analysisDate.includes('日')) {
            // 日付の部分がない場合、現在の日付を使用
            const now = new Date();
            if (analysisDate.match(/^\d{4}年\d{1,2}月$/)) {
                analysisDate = `${analysisDate}${now.getDate()}日`;
            }
        }
        analysisElement.textContent = analysisDate;
        console.log('分析日要素を更新しました:', analysisElement.textContent);
    } else {
        console.error('analysis-date要素が見つかりません');
    }
}

/**
 * 基本情報を更新
 */
function updateBasicInfo() {
    if (!profileData) {
        return;
    }

    // 姓名を取得
    const familyName = profileData.familyName || '';
    const firstName = profileData.firstName || '';
    const fullName = profileData.name || `${familyName} ${firstName}`;

    // タイトルは「総合プロファイリング」のみを表示
    const nameElement = document.getElementById('person-name');
    if (nameElement) {
        nameElement.textContent = '総合プロファイリング';
    }

    // 氏名欄を更新
    const fullNameElement = document.getElementById('full-name');
    if (fullNameElement) {
        fullNameElement.textContent = fullName || '';
    }

    const birthElement = document.getElementById('birth-date');
    if (birthElement) {
        birthElement.textContent = profileData.birthDate || '';
    }

    const genderElement = document.getElementById('gender');
    if (genderElement) {
        // 性別の表示形式を調整
        let displayGender = profileData.gender || '';
        if (displayGender === 'male') {
            displayGender = '男性';
        } else if (displayGender === 'female') {
            displayGender = '女性';
        }
        genderElement.textContent = displayGender;
    }

    const analysisElement = document.getElementById('analysis-date');
    if (analysisElement) {
        // 常に年月日形式で表示
        let analysisDate = profileData.analysisDate || '';

        // 分析日がない場合は現在の日付を使用
        if (!analysisDate) {
            const now = new Date();
            analysisDate = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
        } else if (!analysisDate.includes('日')) {
            // 日付の部分がない場合、現在の日付を使用
            const now = new Date();
            if (analysisDate.match(/^\d{4}年\d{1,2}月$/)) {
                analysisDate = `${analysisDate}${now.getDate()}日`;
            }
        }

        analysisElement.textContent = analysisDate;
    }
}

/**
 * 全タブのデータを設定
 */
function populateAllTabs() {
    console.log('全タブのデータを設定します');

    if (!profileData) {
        console.error('プロフィールデータがないため、タブデータを設定できません');
        return;
    }

    try {
        console.log('人物概要タブを設定...');
        if (profileData.overview) {
            console.log('人物概要データの詳細:');
            console.log('- strengths:', profileData.overview.strengths ? `${profileData.overview.strengths.length}件` : 'なし');
            console.log('- weaknesses:', profileData.overview.weaknesses ? `${profileData.overview.weaknesses.length}件` : 'なし');
            console.log('- compatibility:', profileData.overview.compatibility ? '存在します' : 'なし');
            console.log('- personality:', profileData.overview.personality ? '存在します' : 'なし');
            console.log('- evaluation:', profileData.overview.evaluation ? '存在します' : 'なし');

            populateOverviewTab(profileData.overview);
        } else {
            console.warn('人物概要データがありません');
        }

        console.log('能力評価タブを設定...');
        if (profileData.skills) {
            console.log('能力評価データの詳細:');
            console.log('- evaluations:', profileData.skills.evaluations ? `${profileData.skills.evaluations.length}件` : 'なし');
            console.log('- interviewQuestions:', profileData.skills.interviewQuestions ? `${profileData.skills.interviewQuestions.length}件` : 'なし');
            console.log('- warningSignals:', profileData.skills.warningSignals ? `${profileData.skills.warningSignals.length}件` : 'なし');

            populateSkillsTab(profileData.skills);
        } else {
            console.warn('能力評価データがありません');
        }

        console.log('キャリア適性タブを設定...');
        if (profileData.career) {
            console.log('キャリア適性データの詳細:');
            console.log('- aptitudeScores:', profileData.career.aptitudeScores ? `${profileData.career.aptitudeScores.length}件` : 'なし');
            console.log('- businessAreas:', profileData.career.businessAreas ? `${profileData.career.businessAreas.length}件` : 'なし');
            console.log('- successKeywords:', profileData.career.successKeywords ? `${profileData.career.successKeywords.length}件` : 'なし');
            console.log('- suitableFields:', profileData.career.suitableFields ? `${profileData.career.suitableFields.length}件` : 'なし');

            populateCareerTab(profileData.career);
        } else {
            console.warn('キャリア適性データがありません');
        }

        console.log('未来予測タブを設定...');
        if (profileData.future) {
            console.log('未来予測データの詳細:');
            console.log('- timeline:', profileData.future.timeline ? `${profileData.future.timeline.length}件` : 'なし');
            console.log('- careerProposals:', profileData.future.careerProposals ? `${profileData.future.careerProposals.length}件` : 'なし');

            populateFutureTab(profileData.future);
        } else {
            console.warn('未来予測データがありません');
        }

        console.log('プラスオンタブを設定...');
        if (profileData.plus) {
            console.log('プラスオンデータの詳細:');
            console.log('- asBoss:', profileData.plus.asBoss ? '存在します' : 'なし');
            console.log('- asSubordinate:', profileData.plus.asSubordinate ? '存在します' : 'なし');
            console.log('- asLeader:', profileData.plus.asLeader ? '存在します' : 'なし');

            populatePlusTab(profileData.plus);
        } else {
            console.warn('プラスオンデータがありません');
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
