export class AskOracleService {
  /**
   * @param {Date} birthDate
   */
  constructor(birthDate) {
    const year = birthDate.getFullYear(); // YYYY
    const month = String(birthDate.getMonth() + 1).padStart(2, '0'); // MM
    const day = String(birthDate.getDate()).padStart(2, '0'); // DD
    this.url = `https://www.ask-oracle.com/birthday/${year}/${month}/${day}/`;
  }

  async getContent() {
    try {
      // ページを取得
      const response = await fetch(this.url);

      // 抽出したコンテンツを保存する変数
      let extractedContent = '';

      // HTMLRewriterを使ってコンテンツを抽出
      const rewriterResponse = new HTMLRewriter()
        .on('#birthday', {
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
