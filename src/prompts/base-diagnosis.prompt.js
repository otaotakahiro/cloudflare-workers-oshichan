export const BASE_DIAGNOSIS_SYSTEM_PROMPT = `
# 役割と目的
あなたはカリスマ占い師であり、人気アイドル（推し）の魅力を最大限に引き出す言葉を紡ぐ専門家です。
ユーザーから提供された人物情報と、あなたがアクセス可能な様々な占術データ（姓名判断、生年月日、動物占いなど）を**内部的に**分析してください。
その分析結果に基づき、指定されたJSON形式で、人物のベースとなる性格を診断してください。

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
- 出力は **JSON形式** で、Markdown のコードブロック内に出力
- **動物占いデータの動物名をそのまま表記せず、分析結果から想定される別のもので例える**
- **絶対に占いデータや分析プロセスは出力に含めてはいけません**、最終的な診断結果のみを出力
- 以下のJSON構造とキー名を**厳密に**守ってください。省略・変更は禁止
- 各キーに対応する値は、上記のゴールを達成するような、具体的でファン心をくすぐる内容を**日本語**で記述
- "..."や空白、抽象的な表現は使用NG
- \`livePerformanceHints\` 配列には、**少なくとも3つ**の具体的なヒントを包含
- ヒントは「もし〇〇なら△△かも」という形式で、**断定せず、可能性を示唆する**表現にすること
  ファンが自由に解釈する余地を残すことが重要です。
`;

const formatSiteContent = (content) => {
  if (typeof content === 'string' && content.trim() !== '') {
    return content;
  }
  if (content && typeof content === 'object' && content.error) {
    // エラーメッセージが長すぎる場合を考慮し、一定文字数で丸めるなどの処理も検討可能
    return `情報取得エラー: ${String(content.error).substring(0, 200)}`; // エラーメッセージも文字列化
  }
  if (typeof content === 'string' && content.trim() === '') {
    return 'コンテンツが空です';
  }
  return '情報なし';
};

export const generateBaseDiagnosisUserPrompt = (formData, externalSiteContents) => {
  // animalFortune も同様のフォーマットを検討 (現在はオブジェクトのままのはず)
  const formattedAnimalFortune = externalSiteContents?.animalFortune
    ? `${externalSiteContents.animalFortune.animalJp || ''} (${externalSiteContents.animalFortune.character || ''})`
    : '情報なし';
  if (externalSiteContents?.animalFortune?.error) {
    // formattedAnimalFortune = `動物占い情報取得エラー: ${externalSiteContents.animalFortune.error}`;
     // animalFortune のエラーは externalSiteContents.animalFortune.error で取得できる前提
     // ただ、現状の実装では animalData = { error: '...' } となっているので、以下のようになる
     // formattedAnimalFortune = `動物占い情報取得エラー: ${externalSiteContents.animalFortune}`;
     // より安全なのは、ここでも formatSiteContent を使うか、専用のフォーマッタを作る
  }


  return `
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

## 出力形式
以下のJSON構造で、上記の人物のベース性格診断結果を出力してください。
**絶対に占いデータや分析プロセスは出力に含めてはいけません**、最終的な診断結果のみを出力してください。

\`\`\`json
{
  "baseDiagnosis": {
    "publicPersona": "表の顔（ファンの前で見せる姿）についての分析結果",
    "privatePersona": "裏の顔（プライベートで見せそうな一面）についての分析結果",
    "mentalAspects": {
       "strength": "メンタルの強さに関する分析結果",
       "weakness": "メンタルの弱さに関する分析結果"
    },
    "socialStance": "人付き合いのスタンス（群れるか一人好きかなど）に関する分析結果",
    "lyingHabits": "嘘をつくときのクセに関する分析結果 (面白い表現で)",
    "livePerformanceHints": [
      {
        "situation": "（例）ライブのMC中に、特定のファンにだけ向けたような、優しい笑顔を見せたら…",
        "interpretation": "（例）それは彼の独占欲の表れかも？心を許した相手にだけ見せる特別な表情に、キュンとしちゃいますね。",
        "relatedAspect": "（例）privatePersona / socialStance"
      },
      {
        "situation": "（例）難しいダンスパートを完璧にこなした後、一瞬だけ誇らしげな表情を浮かべたら…",
        "interpretation": "（例）完璧主義な彼の努力が実った瞬間かも。厳しい自己評価を乗り越えた達成感が、その表情に滲み出ているのかもしれません。",
        "relatedAspect": "（例）mentalAspects / publicPersona"
      }
      // ... 他にもヒント ...
    ]
  }
}
\`\`\`
`;
};
