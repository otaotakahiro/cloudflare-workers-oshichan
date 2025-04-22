/**
 * 人物概要タブのデータを設定するモジュール
 */

/**
 * 人物概要タブのデータを設定
 * @param {Object} overview - 人物概要データ
 */
export function populateOverviewTab(overview) {
    console.log('人物概要タブのデータ:', overview);

    if (!overview) {
        console.error('人物概要データが存在しません');
        return;
    }

    // 全体のコンテナを取得
    const container = document.getElementById('overview-content');
    if (!container) {
        console.error('人物概要コンテナが見つかりません');
        return;
    }

    // HTMLの既存の構造を保持するため、強みと短所のh2要素を維持
    // タイトルを追加する代わりに既存のHTMLタイトルを活用

    // 強み表示
    populateStrengths(overview.strengths);

    // 短所表示
    populateWeaknesses(overview.weaknesses);

    // 相性タイプと人物像を格納するフレックスコンテナを作成
    const flexContainer = document.createElement('div');
    flexContainer.className = 'grid grid-cols-1 md:grid-cols-2';
    container.appendChild(flexContainer);

    // 相性タイプと人物像のコンテナを作成
    const compatibilityContainer = document.createElement('div');
    compatibilityContainer.id = 'compatibility-container';
    flexContainer.appendChild(compatibilityContainer);

    const personalityContainer = document.createElement('div');
    personalityContainer.id = 'personality-container';
    flexContainer.appendChild(personalityContainer);

    // 相性タイプ表示
    populateCompatibility(overview.compatibility);

    // 人物像表示
    populatePersonality(overview.personality);

    // 総合評価表示
    populateEvaluation(overview.evaluation);
}

/**
 * 強みリストの表示
 * @param {Array} strengths - 強みの配列
 */
function populateStrengths(strengths) {
    console.log('強みデータ:', strengths);

    if (!strengths || !strengths.length) {
        console.warn('強みデータが存在しないか空です');
        return;
    }

    const container = document.getElementById('strengths-list');
    if (!container) {
        console.error('強みコンテナが見つかりません (ID: strengths-list)');
        return;
    }

    container.innerHTML = '';
    container.className = 'mt-2';

    strengths.forEach((strength, index) => {
        console.log(`強み ${index + 1}:`, strength);
        const li = document.createElement('li');
        li.className = 'flex items-start mb-1';
        li.innerHTML = `
            <span class="mr-2">•</span>
            <span>${strength}</span>
        `;
        container.appendChild(li);
    });
}

/**
 * 短所リストの表示
 * @param {Array} weaknesses - 短所の配列
 */
function populateWeaknesses(weaknesses) {
    console.log('短所データ:', weaknesses);

    if (!weaknesses || !weaknesses.length) {
        console.warn('短所データが存在しないか空です');
        return;
    }

    const container = document.getElementById('weaknesses-list');
    if (!container) {
        console.error('短所コンテナが見つかりません (ID: weaknesses-list)');
        return;
    }

    container.innerHTML = '';
    container.className = 'mt-2';

    weaknesses.forEach((weakness, index) => {
        console.log(`短所 ${index + 1}:`, weakness);
        const li = document.createElement('li');
        li.className = 'flex items-start mb-1';
        li.innerHTML = `
            <span class="mr-2">•</span>
            <span>${weakness}</span>
        `;
        container.appendChild(li);
    });
}

/**
 * 相性タイプセクションの表示
 * @param {Object} compatibility - 相性タイプデータ
 */
function populateCompatibility(compatibility) {
    if (!compatibility || !compatibility.types || !compatibility.types.length) return;

    const container = document.getElementById('compatibility-container');
    if (!container) return;

    // h2タイトルを保存（非表示にする）
    const title = container.querySelector('h2');

    // コンテナをクリア
    container.innerHTML = '';

    // 保存したタイトルを再度追加（非表示）
    if (title) {
        title.style.display = 'none'; // タイトルを非表示に
        container.appendChild(title);
    }

    // 相性タイプのコンテナ（白背景のカード）
    const compatibilitySection = document.createElement('div');
    compatibilitySection.className = 'mt-6 bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden';

    // アイコン付きタイトル（背景色付き）
    const compatibilityTitle = document.createElement('div');
    compatibilityTitle.className = 'text-green-600 font-bold text-lg bg-green-50 p-3 border-b border-gray-200 flex items-center';
    compatibilityTitle.innerHTML = '<i class="fas fa-handshake mr-2"></i>相性の良い人物像';
    compatibilitySection.appendChild(compatibilityTitle);

    // コンテンツコンテナ
    const contentContainer = document.createElement('div');
    contentContainer.className = 'p-4';
    compatibilitySection.appendChild(contentContainer);

    // 各タイプの表示
    compatibility.types.forEach((type, index) => {
        const typeDiv = document.createElement('div');
        typeDiv.className = index < compatibility.types.length - 1 ? 'mb-4 pb-4 border-b border-gray-200' : 'mb-2';

        // タイトル（太字）
        const typeTitle = document.createElement('div');
        typeTitle.className = 'font-bold mb-1';
        typeTitle.textContent = type.title;
        typeDiv.appendChild(typeTitle);

        // 説明文
        const typeDesc = document.createElement('p');
        typeDesc.className = 'text-sm mb-2';
        typeDesc.textContent = type.description;
        typeDiv.appendChild(typeDesc);

        // タグの表示
        if (type.tags && type.tags.length) {
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'flex flex-wrap gap-2 mb-2';

            // タグを分類（活力、親和性、行動力）
            const tagClasses = {
                '活力': 'bg-green-100 text-green-700',
                '親和性': 'bg-blue-100 text-blue-700',
                '行動力': 'bg-yellow-100 text-yellow-700',
                'default': 'bg-gray-100 text-gray-700'
            };

            type.tags.forEach(tag => {
                const tagSpan = document.createElement('span');
                // タグ名に応じてクラスを選択
                const tagClass = Object.keys(tagClasses).find(key => tag.includes(key))
                    ? tagClasses[Object.keys(tagClasses).find(key => tag.includes(key))]
                    : tagClasses.default;

                tagSpan.className = `inline-block ${tagClass} rounded-full px-3 py-1 text-xs`;
                tagSpan.textContent = tag;
                tagsContainer.appendChild(tagSpan);
            });

            typeDiv.appendChild(tagsContainer);
        }

        // 注釈がある場合
        if (type.note) {
            const noteP = document.createElement('p');
            noteP.className = 'text-xs text-gray-500 mt-1';
            noteP.textContent = type.note;
            typeDiv.appendChild(noteP);
        }

        contentContainer.appendChild(typeDiv);
    });

    container.appendChild(compatibilitySection);
}

/**
 * 人物像セクションの表示
 * @param {Object} personality - 人物像データ
 */
function populatePersonality(personality) {
    if (!personality) return;

    const container = document.getElementById('personality-container');
    if (!container) return;

    // h2タイトルを保存（非表示にする）
    const title = container.querySelector('h2');

    // コンテナをクリア
    container.innerHTML = '';

    // 保存したタイトルを再度追加（非表示）
    if (title) {
        title.style.display = 'none'; // タイトルを非表示に
        container.appendChild(title);
    }

    // 人物像コンテナ（白背景のカード）
    const personalitySection = document.createElement('div');
    personalitySection.className = 'mt-6 bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden';

    // アイコン付きタイトル（背景色付き）
    const personalityTitle = document.createElement('div');
    personalityTitle.className = 'text-purple-600 font-bold text-lg bg-purple-50 p-3 border-b border-gray-200 flex items-center';
    personalityTitle.innerHTML = '<i class="fas fa-user mr-2"></i>人物像総括';
    personalitySection.appendChild(personalityTitle);

    // コンテンツコンテナ
    const contentContainer = document.createElement('div');
    contentContainer.className = 'p-4';
    personalitySection.appendChild(contentContainer);

    // 人物像の要約
    if (personality.summary) {
        const summaryP = document.createElement('p');
        summaryP.className = 'mb-3';
        summaryP.textContent = personality.summary;
        contentContainer.appendChild(summaryP);
    }

    // 行動特性と印象のグリッド
    const traitsGrid = document.createElement('div');
    traitsGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-4 mt-2';

    // 行動特性
    if (personality.behavior) {
        const behaviorDiv = document.createElement('div');

        const behaviorTitle = document.createElement('div');
        behaviorTitle.className = 'text-sm font-semibold mb-1';
        behaviorTitle.textContent = '行動特性';
        behaviorDiv.appendChild(behaviorTitle);

        const behaviorContent = document.createElement('div');
        behaviorContent.className = 'bg-gray-50 p-2 rounded-md border border-gray-200';

        const behaviorType = document.createElement('p');
        behaviorType.className = 'text-sm';
        behaviorType.textContent = personality.behavior.type || '';
        behaviorContent.appendChild(behaviorType);

        const behaviorDesc = document.createElement('p');
        behaviorDesc.className = 'text-xs text-gray-600';
        behaviorDesc.textContent = personality.behavior.description || '';
        behaviorContent.appendChild(behaviorDesc);

        behaviorDiv.appendChild(behaviorContent);
        traitsGrid.appendChild(behaviorDiv);
    }

    // 印象
    if (personality.impression) {
        const impressionDiv = document.createElement('div');

        const impressionTitle = document.createElement('div');
        impressionTitle.className = 'text-sm font-semibold mb-1';
        impressionTitle.textContent = '印象';
        impressionDiv.appendChild(impressionTitle);

        const impressionContent = document.createElement('div');
        impressionContent.className = 'bg-gray-50 p-2 rounded-md border border-gray-200';

        const impressionType = document.createElement('p');
        impressionType.className = 'text-sm';
        impressionType.textContent = personality.impression.type || '';
        impressionContent.appendChild(impressionType);

        const impressionDesc = document.createElement('p');
        impressionDesc.className = 'text-xs text-gray-600';
        impressionDesc.textContent = personality.impression.description || '';
        impressionContent.appendChild(impressionDesc);

        impressionDiv.appendChild(impressionContent);
        traitsGrid.appendChild(impressionDiv);
    }

    contentContainer.appendChild(traitsGrid);
    container.appendChild(personalitySection);
}

/**
 * 総合評価セクションの表示
 * @param {Object} evaluation - 評価データ
 */
function populateEvaluation(evaluation) {
    if (!evaluation) return;

    const container = document.getElementById('evaluation-container');
    if (!container) return;

    // h2タイトルを保存（非表示にする）
    const title = container.querySelector('h2');

    // コンテナをクリア
    container.innerHTML = '';

    // 保存したタイトルを再度追加（非表示）
    if (title) {
        title.style.display = 'none'; // タイトルを非表示に
        container.appendChild(title);
    }

    // 総合評価コンテナ（白背景のカード）
    const evaluationSection = document.createElement('div');
    evaluationSection.className = 'mt-6 bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden';

    // アイコン付きタイトル（背景色付き）
    const evaluationTitle = document.createElement('div');
    evaluationTitle.className = 'text-blue-600 font-bold text-lg bg-blue-50 p-3 border-b border-gray-200 flex items-center';
    evaluationTitle.innerHTML = '<i class="fas fa-clipboard-check mr-2"></i>総合評価';
    evaluationSection.appendChild(evaluationTitle);

    // コンテンツコンテナ
    const contentContainer = document.createElement('div');
    contentContainer.className = 'p-4';
    evaluationSection.appendChild(contentContainer);

    // 評価サマリー
    if (evaluation.summary) {
        const summaryP = document.createElement('p');
        summaryP.className = 'mb-3';
        summaryP.textContent = evaluation.summary;
        contentContainer.appendChild(summaryP);
    }

    // 長所と短所のグリッド
    const strengthsWeaknessesGrid = document.createElement('div');
    strengthsWeaknessesGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-4 mt-2';

    // 長所セクション
    const strengthsDiv = document.createElement('div');
    const strengthsTitle = document.createElement('div');
    strengthsTitle.className = 'text-blue-700 font-bold mb-1';
    strengthsTitle.textContent = '長所';
    strengthsDiv.appendChild(strengthsTitle);

    const strengthsContent = document.createElement('div');
    strengthsContent.className = 'bg-gray-50 p-2 rounded-md border border-gray-200';
    strengthsContent.textContent = evaluation.strengths || '';
    strengthsDiv.appendChild(strengthsContent);
    strengthsWeaknessesGrid.appendChild(strengthsDiv);

    // 短所セクション
    const weaknessesDiv = document.createElement('div');
    const weaknessesTitle = document.createElement('div');
    weaknessesTitle.className = 'text-red-700 font-bold mb-1';
    weaknessesTitle.textContent = '短所';
    weaknessesDiv.appendChild(weaknessesTitle);

    const weaknessesContent = document.createElement('div');
    weaknessesContent.className = 'bg-gray-50 p-2 rounded-md border border-gray-200';
    weaknessesContent.textContent = evaluation.weaknesses || '';
    weaknessesDiv.appendChild(weaknessesContent);
    strengthsWeaknessesGrid.appendChild(weaknessesDiv);

    contentContainer.appendChild(strengthsWeaknessesGrid);

    // 結論
    if (evaluation.conclusion) {
        const conclusionDiv = document.createElement('div');
        conclusionDiv.className = 'mt-3 p-2 bg-gray-50 rounded-md border border-gray-200';
        conclusionDiv.textContent = evaluation.conclusion;
        contentContainer.appendChild(conclusionDiv);
    }

    container.appendChild(evaluationSection);
}
