// タブモジュールをインポート
import { populateOverviewTab } from './tabs-overview.js';
// import { populateSkillsTab } from './tabs-skills.js'; // 削除
// import { populateCareerTab } from './tabs-career.js'; // 削除
// import { populateFutureTab } from './tabs-future.js'; // 削除
// import { populatePlusTab } from './tabs-plus.js'; // 削除
import { populateLivePerformanceTab } from './tabs-live-performance.js'; // 新規追加

// インポートの確認用ログ
console.log('タブモジュールのインポート状態:');
console.log('- populateOverviewTab:', typeof populateOverviewTab === 'function' ? '読み込み成功' : '読み込み失敗');
console.log('- populateLivePerformanceTab:', typeof populateLivePerformanceTab === 'function' ? '読み込み成功' : '読み込み失敗'); // 新規追加
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
        document.getElementById('overview-tab'),
        document.getElementById('skills-tab') // 「ライブでの輝き」タブ
        // 非表示にしたタブのボタンは含めない
    ].filter(button => button !== null);

    console.log('タブボタン取得状態:', tabButtons.length, '個見つかりました');

    const tabContents = [
        document.getElementById('overview-content'),
        document.getElementById('skills-content') // 「ライブでの輝き」タブのコンテンツエリア
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

        // apiResponse.result が profileData となる。期待する構造は { base: {...}, formData: (オプション) ... }
        profileData = apiResponse.result;
        console.log('Parsed profileData:', JSON.stringify(profileData, null, 2));

        // 修正: profileData.diagnosis.base の存在を確認
        if (!profileData || !profileData.diagnosis || !profileData.diagnosis.base) {
            console.error('Error details:', {
                hasProfileData: !!profileData,
                hasDiagnosis: !!(profileData && profileData.diagnosis),
                hasBase: !!(profileData && profileData.diagnosis && profileData.diagnosis.base)
            });
            showError('診断データ(base)が見つかりませんでした。');
            throw new Error('Invalid data structure: base not found in profileData.diagnosis.');
        }

        // formData はオプションとして扱う
        if (!profileData.formData) {
            console.warn('フォームデータ(formData)がprofileData内に見つかりませんでした。ヘッダー情報の一部が欠けるか、baseから推測されます。');
        }

        // 修正: updateProfileInfo に渡す引数を調整
        updateProfileInfo(profileData.formData, profileData.diagnosis.base);
        // 修正: populateAllTabs は profileData.diagnosis を渡すか、内部で .diagnosis.base を見るようにする。
        // populateAllTabs の実装を確認後、適切な方を渡す。
        // 現時点では、populateAllTabs が profileData.base を直接参照している可能性があるため、
        // populateAllTabs(profileData.diagnosis); のように変更するか、
        // populateAllTabs() のままにして populateAllTabs 内部を修正するか検討。
        // まずは呼び出し側で profileData.diagnosis を渡してみる。
        populateAllTabs(profileData.diagnosis); // 渡すデータを変更

    } catch (error) {
        console.error('Error loading result data:', error);
        showError(`データの読み込み中にエラーが発生しました: ${error.message}`);
    }
}

/**
 * プロファイル情報（ヘッダー部分）を更新
 * @param {Object} userInfo - ユーザー情報オブジェクト
 */
function updateProfileInfo(formData, baseData) {
    let oshiFullName = '推し';
    let oshiGender = '-';
    let oshiBirthDate = '-';

    // formData が存在する場合のみ、そこから情報を取得
    if (formData) {
        if (formData.familyName && formData.firstName) {
            oshiFullName = `${formData.familyName} ${formData.firstName}`.trim();
        } else if (formData.name) {
            oshiFullName = formData.name.trim();
        }
        // formData に名前情報がない場合でも、baseData からのフォールバックは後続で行う

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

    // formData に名前情報がなかった、または formData 自体がなかった場合、baseData.publicPersona からの抽出を試みる
    if (oshiFullName === '推し' && baseData && baseData.publicPersona) {
        const match = baseData.publicPersona.match(/^(.*?)(は|のステージ)/);
        if (match && match[1]) {
            oshiFullName = match[1].trim();
        }
    }

    const oshiNamePlaceholder = document.getElementById('oshi-name-placeholder');
    if (oshiNamePlaceholder) {
        oshiNamePlaceholder.textContent = oshiFullName;
    }

    const fullNameElement = document.getElementById('full-name');
    if (fullNameElement) {
        fullNameElement.textContent = oshiFullName;
    }

    const genderElement = document.getElementById('gender');
    if (genderElement) {
        genderElement.textContent = oshiGender;
    }

    const birthDateElement = document.getElementById('birth-date');
    if (birthDateElement) {
        birthDateElement.textContent = oshiBirthDate;
    }

    const analysisDateElement = document.getElementById('analysis-date');
    if (analysisDateElement) {
        const now = new Date();
        analysisDateElement.textContent = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
    }
}

/**
 * 全タブのデータを設定
 */
function populateAllTabs(data) {
    console.log('全タブのデータを設定します');
    // profileData と profileData.base の存在をチェック
    if (!data || !data.base) {
        console.error('プロフィールデータまたはbaseデータがないため、タブデータを設定できません');
        return;
    }

    try {
        console.log('基本データタブを設定...');
        populateOverviewTab(data.base); // profileData.base を直接渡す

        console.log('ライブでの輝きタブを設定...');
        if (data.base.livePerformanceHints) {
            populateLivePerformanceTab(data.base.livePerformanceHints);
        } else {
            console.warn('ライブでの輝きデータ(livePerformanceHints)がありません');
            const skillsContent = document.getElementById('skills-content');
            if (skillsContent) {
                skillsContent.innerHTML = '<div class="p-4 text-gray-500">ライブパフォーマンスに関するヒントはありません。</div>';
            }
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
