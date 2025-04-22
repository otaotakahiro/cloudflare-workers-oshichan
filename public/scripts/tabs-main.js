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

// テスト用のモックデータ
const TEST_DATA = {
    name: "テスト 太郎",
    birthDate: "1990年1月1日",
    gender: "男性",
    analysisDate: "2025年4月",
    overview: {
        strengths: ["論理的思考力が高い", "忍耐強く取り組める", "細部への配慮ができる", "誠実で信頼される", "集中力がある"],
        weaknesses: ["完璧主義の傾向がある", "決断に時間がかかる", "感情表現が少ない", "柔軟性に欠けることがある", "自己主張が弱い"],
        compatibility: {
            types: [
                {
                    title: "論理派リーダー",
                    description: "物事を論理的に分析し、合理的な判断で組織を導く力があります。",
                    tags: ["分析力", "論理性", "決断力"],
                    note: "感情的要素も取り入れるとより良いバランスになります"
                },
                {
                    title: "誠実なサポーター",
                    description: "周囲の人を支える力があり、信頼関係を築くのが上手です。",
                    tags: ["信頼性", "サポート力", "忍耐力"],
                    note: "自分の意見も積極的に出すとより貢献度が増します"
                }
            ]
        },
        personality: {
            summary: "論理的で誠実、責任感が強く信頼される人物です。細部に注意を払い、確実に仕事を進めます。",
            behavior: {
                type: "計画型",
                description: "事前に計画を立て、手順通りに進めることを好みます。"
            },
            impression: {
                type: "信頼型",
                description: "約束を守り、期待通りの成果を出す人という印象を与えます。"
            }
        },
        evaluation: {
            summary: "分析力と忍耐力に優れ、長期的なプロジェクトで実力を発揮します。",
            strengths: "論理的思考と計画性が高く、複雑な問題を着実に解決する能力があります。また、誠実さから信頼される人物です。",
            weaknesses: "完璧を求める傾向があり、時に決断が遅れる場合があります。また、変化への適応には時間がかかることがあります。",
            conclusion: "計画と分析が必要な長期的なプロジェクトでリーダーシップを発揮できる人材です。"
        }
    },
    skills: {
        evaluations: [
            { name: "リーダー適性", score: 4, description: "論理的な判断と誠実さで周囲からの信頼を得ることができます。" },
            { name: "協調性", score: 3, description: "チームの一員として貢献する力がありますが、意見の主張はやや控えめです。" },
            { name: "ストレス耐性", score: 4, description: "忍耐強く長期的な問題に対処する力があります。" },
            { name: "柔軟性", score: 2, description: "計画変更や急な状況変化への適応にはやや時間がかかります。" },
            { name: "主体性", score: 3, description: "自分の担当範囲では主体的に行動できますが、新規の取り組みには慎重です。" }
        ],
        interviewQuestions: [
            {
                question: "計画通りに進まなかった状況で、どのように対応したか例を挙げてください。",
                purpose: "柔軟性と問題解決能力を見るための質問です。計画変更への対応が弱点の可能性があるため、実際の行動を確認します。"
            },
            {
                question: "チーム内で意見が分かれた時、あなたはどのように行動しましたか？",
                purpose: "意見対立における調整能力と自己主張のバランスを確認します。やや自己主張が弱い面があるため、その対処法を見ます。"
            }
        ],
        warningSignals: [
            "完璧を求めすぎて進捗が止まる場合がある",
            "意思決定に必要以上に時間をかけることがある",
            "変化やルール変更に強い抵抗を示すことがある",
            "自分の意見を表明せず、不満を内に溜め込むことがある"
        ]
    },
    career: {
        aptitudeScores: [
            { field: "企画・分析職", score: 90 },
            { field: "研究開発職", score: 85 },
            { field: "品質管理職", score: 80 },
            { field: "技術サポート職", score: 75 },
            { field: "マネジメント職", score: 65 }
        ],
        businessAreas: [
            {
                name: "テクノロジー分析コンサルティング",
                icon: "lightbulb",
                description: "複雑な技術情報を分析し、企業の意思決定をサポートするコンサルティングサービス",
                tags: ["分析力", "論理性", "問題解決"]
            },
            {
                name: "品質管理システム開発",
                icon: "chart-line",
                description: "生産プロセスやサービス提供の品質を高めるためのシステム構築やコンサルティング",
                tags: ["細部への注意", "計画性", "改善力"]
            }
        ],
        successKeywords: [
            {
                title: "専門性の深化",
                icon: "graduation-cap",
                description: "特定分野の専門知識を深め、その道のエキスパートとして認められることで価値を高める"
            },
            {
                title: "プロセス改善",
                icon: "chart-line",
                description: "効率と品質を両立するプロセス構築と改善を追求することで組織に貢献する"
            },
            {
                title: "信頼関係の構築",
                icon: "handshake",
                description: "長期的な信頼関係を築くことで、安定したキャリア基盤を形成する"
            }
        ],
        suitableFields: [
            {
                name: "企画・分析職",
                examples: "データアナリスト、マーケットリサーチャー、経営企画など",
                description: "論理的思考能力と詳細な分析力を活かせる職種です。複雑なデータから意味を見出し、計画立案する能力が発揮できます。"
            },
            {
                name: "研究開発職",
                examples: "研究員、製品開発エンジニア、技術コンサルタントなど",
                description: "忍耐強く細部にこだわる姿勢が、研究開発での成果につながります。長期的な目標に向けて着実に進める能力が評価されます。"
            },
            {
                name: "品質管理職",
                examples: "品質管理スペシャリスト、検査技術者など",
                description: "詳細への注意力と完璧を求める姿勢が品質向上に貢献します。プロセスを徹底的に検証する能力が強みとなります。"
            }
        ]
    },
    future: {
        timeline: [
            {
                period: "半年後",
                term: "短期",
                phase: "適応期",
                description: "現在の環境で信頼を獲得する時期。担当業務で確実な成果を出し、周囲からの評価を高めています。"
            },
            {
                period: "1年後",
                term: "中期",
                phase: "成長期",
                description: "より責任のある業務を任されるようになります。専門知識を深め、チーム内での存在感が増します。"
            },
            {
                period: "3年後",
                term: "中期",
                phase: "発展期",
                description: "これまでの経験を活かしたプロジェクトリーダーとしての役割が期待されます。後進の指導も担当します。"
            },
            {
                period: "5年後",
                term: "長期",
                phase: "確立期",
                description: "専門分野でのエキスパートとして認められ、組織内での立場が確立します。管理職への道も開けてきます。"
            }
        ],
        careerProposals: [
            {
                term: "短期（1年以内）",
                title: "基盤固めと専門性強化",
                icon: "rocket",
                actions: [
                    "現在の業務での成果を確実に出し、信頼を獲得する",
                    "専門知識を深めるための資格取得や学習に取り組む",
                    "組織内の人間関係を強化し、協力体制を築く"
                ]
            },
            {
                term: "中期（1～3年）",
                title: "視野拡大と責任範囲の拡大",
                icon: "chart-line",
                actions: [
                    "小規模なプロジェクトのリーダーとしての経験を積む",
                    "部門を越えた横断的な知識を習得する",
                    "自分の専門性を活かした改善提案を積極的に行う"
                ]
            },
            {
                term: "長期（5年以上）",
                title: "組織的影響力の確立",
                icon: "mountain",
                actions: [
                    "専門分野でのエキスパートとして組織に貢献する",
                    "管理職として部下の育成とチーム力向上に取り組む",
                    "業界内でのネットワークを構築し、外部との連携を強化する"
                ]
            }
        ]
    },
    plus: {
        asBoss: {
            effectiveCommunication: [
                {
                    title: "明確な期待と基準の提示",
                    description: "具体的な目標と評価基準を明確に伝えることで、安心して業務に取り組める環境を作ります。"
                },
                {
                    title: "定期的なフィードバック",
                    description: "適切なタイミングで建設的なフィードバックを行い、成長を促します。"
                },
                {
                    title: "意見の尊重と傾聴",
                    description: "意見や提案を尊重し、真摯に耳を傾けることで、自己表現を促します。"
                }
            ],
            warningSignals: [
                {
                    title: "過度な完璧主義",
                    description: "細部にこだわりすぎて決断が遅れたり、部下に過度なプレッシャーをかけたりすることがあります。"
                },
                {
                    title: "変化への抵抗",
                    description: "既存の方法や計画を変更することに抵抗を示し、柔軟性が低下することがあります。"
                },
                {
                    title: "感情表現の抑制",
                    description: "感情を表に出さないため、部下が真意を読み取りにくく不安を感じることがあります。"
                }
            ]
        },
        asSubordinate: {
            effectiveApproach: [
                {
                    title: "明確な指示と期待の伝達",
                    description: "何を求めているのか、どのような基準で評価されるのかを明確に伝えることで安心して業務に取り組めます。"
                },
                {
                    title: "定期的なフィードバック",
                    description: "進捗状況を確認し、適切なタイミングでフィードバックを提供することでモチベーションを維持できます。"
                },
                {
                    title: "自己表現の促進",
                    description: "意見や提案を積極的に求め、それを尊重する姿勢を示すことで自己表現を促進できます。"
                }
            ],
            warningSignals: [
                {
                    title: "過度な期待と要求",
                    description: "高すぎる基準を設定すると、プレッシャーを感じて萎縮することがあります。"
                },
                {
                    title: "曖昧な指示",
                    description: "不明確な指示や頻繁な方針変更は不安を引き起こし、パフォーマンスを低下させます。"
                },
                {
                    title: "否定的なフィードバックのみ",
                    description: "批判ばかりで肯定的な評価がないと、自信を喪失することがあります。"
                }
            ]
        },
        asLeader: {
            goalDirections: [
                {
                    title: "明確で測定可能な目標",
                    description: "具体的で達成度を測定できる目標を設定することで、方向性が明確になります。"
                },
                {
                    title: "長期的視点を持った計画",
                    description: "短期的な成果だけでなく、長期的な価値創造を見据えた目標が効果的です。"
                },
                {
                    title: "品質と効率のバランス",
                    description: "質の高さと効率性の両立を目指す目標が、強みを最大限に活かせます。"
                }
            ],
            teamComposition: [
                {
                    title: "創造的思考の持ち主",
                    description: "新しいアイデアを生み出す人材がチームにいると、視野が広がり柔軟性が増します。"
                },
                {
                    title: "行動力のある実践者",
                    description: "計画を迅速に実行に移せる人材がいると、意思決定の遅れを補完できます。"
                },
                {
                    title: "感情表現豊かなコミュニケーター",
                    description: "チーム内の雰囲気を和らげ、感情面でのサポートを提供できる人材が有効です。"
                },
                {
                    title: "柔軟性の高い変化対応者",
                    description: "変化や予期せぬ状況に適応できる人材がいると、チーム全体の適応力が向上します。"
                }
            ]
        }
    }
};

// デバッグ情報を処理するための機能（コンソールのみに出力）
function updateDebug(message) {
    // コンソール出力のみにする
    if (process.env.NODE_ENV !== 'production') {
        console.log("デバッグ情報:", message);
    }
}

// グローバルスコープでアクセス可能なテストデータロード関数
window.loadTestData = function() {
    console.log('loadTestData関数が呼び出されました');

    // テストデータを直接使用
    profileData = TEST_DATA;

    // 基本情報を更新
    updateBasicInfo();

    // 全タブのデータを設定
    populateAllTabs();

    // ローディングインジケータを非表示
    showLoadingIndicator(false);

    console.log('テストデータのロードが完了しました');
};

// 自動テストデータロードを無効化（API動作テストのため）
// window.addEventListener('load', function() {
//    console.log('ページロード完了、テストデータを自動ロードします');
//    window.loadTestData();
// });

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
    try {
        showLoadingIndicator(true);
        console.log('データ読み込み開始');

        // URLからパラメータを取得
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        // フォームデータをURLパラメータから取得
        const familyName = urlParams.get('familyName') || '';
        const firstName = urlParams.get('firstName') || '';
        const birthdate = urlParams.get('birthdate') || '';
        const gender = urlParams.get('gender') || '';

        // 名前を組み合わせる
        const name = familyName && firstName ? `${familyName} ${firstName}` : '';

        // デバッグ用に詳細なログを出力
        console.log('URL パラメータの詳細情報:');
        console.log('- URL:', window.location.href);
        console.log('- クエリパラメータ:', window.location.search);
        console.log('- familyName:', familyName, '(空文字列かどうか:', familyName === '', ')');
        console.log('- firstName:', firstName, '(空文字列かどうか:', firstName === '', ')');
        console.log('- 組み合わせた名前:', name);
        console.log('- birthdate:', birthdate);
        console.log('- gender:', gender);

        // テスト用のフォールバック（実際のデータがない場合のみ使用）
        const fallbackFamilyName = familyName || 'テスト';
        const fallbackFirstName = firstName || '太郎';
        const fallbackName = name || `${fallbackFamilyName} ${fallbackFirstName}`;

        // 日付をフォーマット
        let formattedBirthDate = '';
        if (birthdate) {
            try {
                const date = new Date(birthdate);
                formattedBirthDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
            } catch (e) {
                console.error('日付の変換に失敗しました:', e);
                formattedBirthDate = birthdate;
            }
        }

        // 現在の日付を分析日として使用
        const now = new Date();
        const analysisDate = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;

        if (!id) {
            console.error('IDパラメータがありません');
            showError('結果IDが指定されていません。URLを確認してください。');
            showLoadingIndicator(false);
            return;
        }

        // APIからのユーザー情報を手動で設定（URLパラメータから取得）
        const userInfo = {
            name: fallbackName,
            familyName: familyName,
            firstName: firstName,
            birthDate: formattedBirthDate,
            gender: gender,
            analysisDate: analysisDate
        };

        // ユーザー情報を更新（APIリクエスト前に表示を更新）
        console.log('プロファイル情報を更新します:', userInfo);
        updateProfileInfo(userInfo);

        console.log('リクエストするID:', id);

        // キャッシュを防ぐためにタイムスタンプパラメータを追加
        const timestamp = new Date().getTime();
        const apiUrl = `/api/results/${id}?_t=${timestamp}`;
        console.log('リクエストURL:', apiUrl);

        try {
            const response = await fetch(apiUrl);
            console.log('APIレスポンスステータス:', response.status);

            if (!response.ok) {
                throw new Error(`HTTPエラー: ${response.status}`);
            }

            const data = await response.json();

            // API応答データの詳細をデバッグ表示
            console.log('%cAPIレスポンス詳細:', 'color: blue; font-weight: bold;');
            console.log('受信データ:', data);

            if (data.result) {
                console.log('%cレスポンス構造:', 'color: green; font-weight: bold;');
                console.log('result内のキー:', Object.keys(data.result));

                // JSONを詳細に調査
                let resultData = {
                    // フォームデータを優先的に使用
                    name: name,
                    familyName: familyName,
                    firstName: firstName,
                    birthDate: formattedBirthDate,
                    gender: gender,
                    analysisDate: analysisDate
                };

                // 入力されたユーザー情報をデバッグ表示
                console.log('%cフォームから取得したユーザー情報:', 'color: green; font-weight: bold;');
                console.log('name:', resultData.name);
                console.log('familyName:', resultData.familyName);
                console.log('firstName:', resultData.firstName);
                console.log('birthDate:', resultData.birthDate);
                console.log('gender:', resultData.gender);
                console.log('analysisDate:', resultData.analysisDate);

                // userInfoの詳細を確認するデバッグコード
                if (data.result.data.userInfo) {
                    console.log('%cuserInfo詳細内容:', 'color: red; font-weight: bold;');
                    console.log(JSON.stringify(data.result.data.userInfo, null, 2));
                    console.log('userInfoのキー:', Object.keys(data.result.data.userInfo));

                    // APIから取得したuserInfoを使用
                    const apiUserInfo = data.result.data.userInfo;

                    // resultDataにAPIのユーザー情報をマージ（APIデータを優先）
                    resultData.name = apiUserInfo.name || resultData.name;
                    resultData.birthDate = apiUserInfo.birthDate || resultData.birthDate;
                    resultData.gender = apiUserInfo.gender || resultData.gender;
                    // analysisDate は既存のものを維持

                    // ユーザー情報を更新
                    console.log('APIから取得したuserInfoで更新します:', resultData);
                    updateProfileInfo(resultData); // 更新されたresultDataで直接更新
                } else {
                    console.log('%cuserInfoが存在しません', 'color: red; font-weight: bold;');
                    // userInfoが存在しない場合も、既存の（空の）resultDataでupdateProfileInfoを呼び出す
                    updateProfileInfo(resultData);
                }

                // データ構造の分析（ネストされているか直接か）
                const analyzeStructure = (source, section) => {
                    // セクションが存在するか確認
                    if (!source[section]) {
                        return null;
                    }

                    console.log(`%c${section}セクションの詳細構造:`, 'color: orange; font-weight: bold;');
                    console.log(JSON.stringify(source[section], null, 2));

                    // データが直接アクセス可能か、さらにネストされているか確認
                    if (source[section][section]) {
                        console.log(`${section}は入れ子構造です: ${section}.${section}`);
                        return source[section][section];
                    } else {
                        console.log(`${section}は直接アクセス可能です`);

                        // セクション内の要素をすべて確認
                        const keys = Object.keys(source[section]);
                        console.log(`${section}セクション内のキー:`, keys);

                        // もし必要なキーが全くない場合、セクション自体がデータである可能性を考慮
                        const expectedKeys = ['strengths', 'weaknesses', 'evaluations', 'aptitudeScores', 'timeline', 'asBoss'];
                        const hasExpectedKeys = keys.some(key => expectedKeys.includes(key));

                        if (!hasExpectedKeys && typeof source[section] === 'object') {
                            console.log(`${section}セクションには期待されるキーがありません。セクション全体を返します。`);
                            return source[section];
                        }

                        // もし構造がさらに複雑な場合（例：data.overview.data.strengths）
                        if (source[section].data && typeof source[section].data === 'object') {
                            console.log(`${section}には.dataサブオブジェクトがあります`);
                            return source[section].data;
                        }

                        return source[section];
                    }
                };

                // 各セクションのデータを抽出
                if (data.result.data.overview) {
                    resultData.overview = analyzeStructure(data.result.data, 'overview');
                }

                if (data.result.data.skills) {
                    resultData.skills = analyzeStructure(data.result.data, 'skills');
                }

                if (data.result.data.career) {
                    resultData.career = analyzeStructure(data.result.data, 'career');
                }

                if (data.result.data.future) {
                    resultData.future = analyzeStructure(data.result.data, 'future');
                }

                if (data.result.data.plus) {
                    resultData.plus = analyzeStructure(data.result.data, 'plus');
                }

                // プロファイルデータをグローバル変数に保存
                profileData = resultData;

                if (profileData) {
                    console.log('%c統合されたプロファイルデータ:', 'color: blue; font-weight: bold;');
                    console.log(profileData);

                    // 各タブにデータを渡す
                    updateBasicInfo();

                    try {
                        if (profileData.overview) {
                            console.log('%cOverviewタブを更新:', 'color: blue; font-weight: bold;');
                            try {
                                populateOverviewTab(profileData.overview);
                            } catch (overviewError) {
                                console.error('Overviewタブの更新中にエラーが発生しました:', overviewError);
                            }
                        } else {
                            console.warn('Overviewデータがありません');
                        }

                        if (profileData.skills) {
                            console.log('%cSkillsタブを更新:', 'color: blue; font-weight: bold;');
                            try {
                                populateSkillsTab(profileData.skills);
                            } catch (skillsError) {
                                console.error('Skillsタブの更新中にエラーが発生しました:', skillsError);
                            }
                        } else {
                            console.warn('Skillsデータがありません');
                        }

                        if (profileData.career) {
                            console.log('%cCareerタブを更新:', 'color: blue; font-weight: bold;');
                            try {
                                populateCareerTab(profileData.career);
                            } catch (careerError) {
                                console.error('Careerタブの更新中にエラーが発生しました:', careerError);
                            }
                        } else {
                            console.warn('Careerデータがありません');
                        }

                        if (profileData.future) {
                            console.log('%cFutureタブを更新:', 'color: blue; font-weight: bold;');
                            try {
                                populateFutureTab(profileData.future);
                            } catch (futureError) {
                                console.error('Futureタブの更新中にエラーが発生しました:', futureError);
                            }
                        } else {
                            console.warn('Futureデータがありません');
                        }

                        if (profileData.plus) {
                            console.log('%cPlusタブを更新:', 'color: blue; font-weight: bold;');
                            try {
                                populatePlusTab(profileData.plus);
                            } catch (plusError) {
                                console.error('Plusタブの更新中にエラーが発生しました:', plusError);
                            }
                        } else {
                            console.warn('Plusデータがありません');
                        }
                    } catch (error) {
                        console.error('タブデータの設定中にエラーが発生しました:', error);
                        showError('データの表示中にエラーが発生しました: ' + error.message);
                    }
                }
            } else {
                console.error('result要素が存在しません');
                throw new Error('APIレスポンスにresult要素がありません');
            }
        } catch (error) {
            console.error('APIデータの取得に失敗しました:', error);
            showError(`APIデータの取得に失敗しました: ${error.message}`);
            showLoadingIndicator(false);
            return;
        }

        if (!profileData) {
            console.error('有効なプロフィールデータがありません');
            showError('データ形式が不正です。管理者に連絡してください。');
            showLoadingIndicator(false);
            return;
        }

        // 基本情報とタブ内容を更新
        updateBasicInfo();
        populateAllTabs();

        // 最終確認として、プロファイル情報の値を確実に反映するために再度更新
        setTimeout(() => {
            console.log('最終確認：プロフィール情報を再更新します');
            if (profileData) {
                // 現在のプロファイルデータでDOM要素を更新
                const finalUserInfo = {
                    name: profileData.name,
                    familyName: profileData.familyName,
                    firstName: profileData.firstName,
                    birthDate: profileData.birthDate,
                    gender: profileData.gender,
                    analysisDate: profileData.analysisDate
                };
                updateProfileInfo(finalUserInfo);
            }
        }, 500);

        showLoadingIndicator(false);

    } catch (error) {
        console.error('データ読み込み中にエラーが発生しました:', error);
        showError(`エラーが発生しました: ${error.message}`);
        showLoadingIndicator(false);
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
function showLoadingIndicator(show) {
    console.log('ローディングインジケーター表示状態:', show ? '表示' : '非表示');

    // ローディングインジケータのHTML要素がある場合はその表示/非表示を切り替え
    const loadingElement = document.getElementById('loading-indicator');
    if (loadingElement) {
        console.log('ローディング要素が見つかりました');
        loadingElement.style.display = show ? 'block' : 'none';
    } else {
        console.warn('ローディング要素が見つかりません');
    }
}

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
