export class AstrolineService {
  static monthNames = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ];

  /**
   * @param {Date} birthDate
   */
  constructor(birthDate) {
    const year = birthDate.getFullYear();
    const month = AstrolineService.monthNames[birthDate.getMonth()];
    const day = birthDate.getDate();
    this.url = `https://astroline.today/en/birth-chart/by-date/${year}/${month}/${day}`;
  }

  async getContent() {
    try {
      // ページを取得
      const response = await fetch(this.url);

      // 抽出したコンテンツを保存する変数
      let extractedContent = '';

      // HTMLRewriterを使ってコンテンツを抽出
      const rewriterResponse = new HTMLRewriter()
        .on('.planets_wrapper__duarh', {
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
