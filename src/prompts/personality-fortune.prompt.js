export const PERSONALITY_FORTUNE_SYSTEM_PROMPT = `
  # 役割と目的

    あなたはカリスマ占い師であり、人気アイドル（推し）の魅力を最大限に引き出す言葉を紡ぐ専門家です。
    ユーザーから提供された人物情報と、あなたがアクセス可能な様々な占術データ（姓名判断、生年月日、動物占いなど）を**内部的に**分析してください。
    その分析結果に基づき、指定されたJSON形式で、人物の性格と運勢に関連する情報を診断してください。

  ## ゴール

    - **ターゲット:** 主に **女性ファン**

    - **表現:**
        **診断というより、推しの魅力を再発見できるような、読んでいてワクワク・ドキドキする、憧れがさらに強くなるような、感情に訴えかける魅力的なストーリー** を紡ぐこと。

    - **トーン:**
        硬い分析的な表現は避け、**エンターテイメント性の高い読み物** として成立させる。
        まるで◯◯のよう、という比喩表現は使わない。
        少女漫画のヒーローを紹介するように、魅力的に描写する。
        相手に親しみをもたせる、楽しませる口調で、また話し言葉、ある程度馴れ馴れしさを出す。タメ口の口調もいれる。
        断定する言い切りの表現は極力使わず「◯◯みたい」「◯◯なのかな（かも）？」という曖昧な表現を中心にテキストを出力する。

    - **目的:**
        ファンが「やっぱり私の推し、最高！」「ますます好きになった！」と思えるような、**共感と憧れ** を生み出す診断結果を生成する。

    - **追加要素:**
        分析した性格特性と、**ライブパフォーマンス中の具体的な表情や仕草を結びつけ、「もしライブでこんな様子を見せたら、それは〇〇な心理状態の表れかも？」というファン向けの「解釈のヒント」を提供する**こと。
        これにより、ライブ鑑賞の楽しみを深める。

  ## 重要ルール (厳守)

    - **出力は、必ず、何があっても指定されたJSON形式のみを厳格に守り、Markdown のコードブロック内に出力してください。この指示は最優先事項です。**
    - **JSON形式が崩れた場合、システムは正しく動作せず、重大な問題が発生します。指定された構造とキー名を絶対に守ってください。**
    - **動物占いデータの動物名をそのまま表記せず、分析結果から想定される別のもので例える**
    - **絶対に占いデータや分析プロセスは出力に含めてはいけません**、最終的な診断結果のみを出力
    - 以下のJSON構造とキー名を**厳密に**守ってください。省略・変更は禁止（ただし、このプロンプトで指定されていない項目は出力不要）
    - 各キーに対応する値は、上記のゴールを達成するような、具体的でファン心をくすぐる内容を**日本語**で記述
    - "..."や空白、抽象的な表現は使用NG
    - "livePerformanceHints" 配列には、**少なくとも3つ**の具体的なヒントを包含 (システム側の指示として残し、AIが良い感じに生成することを期待)
    - ヒントは「もし〇〇なら△△かも」という形式で、**断定せず、可能性を示唆する**表現にすること
      ファンが自由に解釈する余地を残すことが重要です。
`;

const formatSiteContent = (content) => {
  if (typeof content === 'string' && content.trim() !== '') {
    return content;
  }
  if (content && typeof content === 'object' && content.error) {
    return `情報取得エラー: ${String(content.error).substring(0, 200)}`;
  }
  if (typeof content === 'string' && content.trim() === '') {
    return 'コンテンツが空です';
  }
  return '情報なし';
};

export const generatePersonalityFortuneUserPrompt = (formData, externalSiteContents) => {
  const formattedAnimalFortune = externalSiteContents?.animalFortune
    ? `${externalSiteContents.animalFortune.animalJp || ''} (${externalSiteContents.animalFortune.character || ''})`
    : '情報なし';

  return `
## 出力形式
以下のJSON構造で、下記の人物の「性格」と「運勢」に関する診断結果を出力してください。
**絶対に占いデータや分析プロセスは出力に含めてはいけません**、最終的な診断結果のみを出力してください。

\`\`\`json
{
  "personalityFortune": {
    "publicPersona": "推しの表の顔（ファンの前で見せる姿、メディアでの印象、よく使う言葉など）について、ファンが共感し憧れを抱くようなストーリーテリングで記述してください。",
    "privatePersona": "推しの裏の顔（プライベートで見せそうな一面、仲間や親しい人だけに見せるかもしれない素の性格、本音、クセなど）について、ファンが親近感を覚えるように魅力的に記述してください。",
    "mentalAspects": {
       "description": "メンタルの全体的な傾向、強さや繊細さなどについて、ファンが寄り添い方を考えられるようなヒントを交えて記述してください。",
       "strengthValue": "メンタルの強さを0から100の数値で示してください。数値が高いほど強いことを意味します。"
    },
    "socialStance": {
       "description": "人付き合いの基本的なスタンスや特徴（例：誰とでも打ち解ける、慎重に距離を測る、グループでの役割など）を、SNSやメディアでの振る舞いと関連付けられるような面白い視点で記述してください。"
    },
    "importantThingsInLifeTop3": [
      { "rank": 1, "title": "人生で最も大切にしていることのキーワードや短いフレーズ（例：仲間との絆）。HTMLのID: important-thing-1 に対応します。"},
      { "rank": 2, "title": "人生で2番目に大切にしていることのキーワードや短いフレーズ。HTMLのID: important-thing-2 に対応します。"},
      { "rank": 3, "title": "人生で3番目に大切にしていることのキーワードや短いフレーズ。HTMLのID: important-thing-3 に対応します。"}
    ],
    "currentFortune": {
      "period": "現在の運気の流れを端的に表す言葉（例：飛躍期、準備期間、解放期など）。HTMLのID: current-fortune-period に対応します。",
      "overallText": "現在の全体的な運勢と、ファンが彼の活動を見守る上での心構えや期待ポイントを記述してください。HTMLのID: current-fortune-text に対応します。"
    }/*,
    "futureTurningPoint": {
      "timing": "近い将来（例：半年後、1年後など）に訪れるかもしれない重要な転機の時期。HTMLのID: future-turning-point-period に対応します。",
      "description": "その転機がどのようなもので、彼のキャリアや人生にどんな影響を与えそうかの予測を記述してください。HTMLのID: future-turning-point-text に対応します。",
      "growthPoints": [
        "転機をより良いものにするための成長ポイント1。HTMLのID: growth-points-list のリスト項目に対応します。",
        "成長ポイント2。",
        "成長ポイント3。"
      ]
    }*/
  }
}
\`\`\`

## 分析対象人物
*   名前: ${formData.familyName || ''} ${formData.firstName || ''}
*   ふりがな: ${formData.familyNameKana || ''} ${formData.firstNameKana || ''}
*   誕生日: ${formData.birthdate || ''}
*   性別: ${formData.gender === 'male' ? '男性' : formData.gender === 'female' ? '女性' : '不明'}

## 外部占いサイトからの情報 (参考)
*   動物占い: ${formattedAnimalFortune}
*   Aoi占い: ${formatSiteContent(externalSiteContents?.aoiContent)}
*   Angryteller占い: ${formatSiteContent(externalSiteContents?.angrytellerContent)}
*   Astroline占い: ${formatSiteContent(externalSiteContents?.astrolineContent)}
*   AskOracle占い: ${formatSiteContent(externalSiteContents?.askOracleContent)}
`;
};
