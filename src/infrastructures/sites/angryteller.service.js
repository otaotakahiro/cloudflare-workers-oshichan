export class AngrytellerService {
  constructor(familyName, firstName) {
    this.url = `https://www.angryteller.com/search?query_1=${familyName}&query_2=${firstName}&query=full`;
  }

  async getContent() {
    try {
      // ページを取得
      const response = await fetch(this.url);

      // 抽出したコンテンツを保存する変数
      let extractedContent = '';

      // HTMLRewriterを使ってコンテンツを抽出
      const rewriterResponse = new HTMLRewriter()
        .on('.results', {
          text(text) {
            extractedContent += text.text;
          },
        })
        .transform(response);

      await rewriterResponse.text();

      return extractedContent;
    } catch (e) {
      console.error(e);

      return undefined;
    }
  }
}
