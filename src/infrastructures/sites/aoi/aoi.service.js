import { aoiUrlMap } from './aoi-url-map.js';

export class AoiService {
    constructor(character, gender) {
        this.character = character;
        this.gender = gender;
        this.baseUrl = 'https://aoi-project.com/animal';
    }

    getUrl() {
        const characterInfo = aoiUrlMap[this.character];

        if (!characterInfo) {
            throw new Error(`Character not found: ${this.character}`);
        }

        const genderName = (() => {
            if (this.gender === 'male') {
                return 'man';
            } else if (this.gender === 'female') {
                return 'woman';
            } else {
                throw new Error(`Invalid gender: ${this.gender}`);
            }
        })();

        return `${this.baseUrl}/${characterInfo.animal}/${characterInfo.key}_${genderName}.php`;
    }

    async getContent() {
        const url = this.getUrl();

        try {
            // ページを取得
            const response = await fetch(url);

            // 抽出したコンテンツを保存する変数
            let extractedContent = '';

            // HTMLRewriterを使ってコンテンツを抽出
            const rewriterResponse = new HTMLRewriter()
                .on('.result', {
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
