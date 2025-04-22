export class ManeqlService {
  static urlMap = {
    lion: 'https://maneql.co.jp/blog/2023/10/26/animal_fortune_telling_lion/',
    elephant: 'https://maneql.co.jp/blog/2023/11/10/animal_fortune_telling_elephant/',
    monkey: 'https://maneql.co.jp/blog/2023/11/16/individual-psychology-monkey/',
    koala: 'https://maneql.co.jp/blog/2023/09/23/animal_fortune_telling_koala/',
    // ...
  };

  constructor(animal) {
    this.url = ManeqlService.urlMap[animal];
  }

  async getContent() {
    try {
      // ページを取得
      const response = await fetch(this.url);

      // 抽出したコンテンツを保存する変数
      let extractedContent = '';

      // HTMLRewriterを使ってコンテンツを抽出
      const rewriterResponse = new HTMLRewriter()
        .on('.single-post-main', {
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
