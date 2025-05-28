/**
 * 恋愛傾向タブのデータを設定するモジュール
 */

/**
 * 「恋愛傾向」タブに診断結果の恋愛関連情報を設定します。
 * @param {object} data - 診断結果のloveTendencyオブジェクト
 */
export function populateLoveTendencyTab(data) {
    console.log('populateLoveTendencyTab 実行。データ:', data);

    if (!data) {
        console.warn('恋愛傾向データが提供されませんでした。');
        return;
    }

    const setText = (id, text) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text || '情報なし';
        } else {
            console.warn(`Element with ID '${id}' not found.`);
        }
    };

    const setHtmlList = (id, listItems) => {
        const element = document.getElementById(id);
        if (element) {
            if (listItems && Array.isArray(listItems) && listItems.length > 0) {
                element.innerHTML = listItems.map(item => `<li>${item}</li>`).join('');
            } else {
                element.innerHTML = '<li>情報なし</li>';
            }
        } else {
            console.warn(`Element with ID '${id}' not found.`);
        }
    };

    // 恋愛傾向を一言で
    setText('love-tendency-summary', data.oneWordSummary);
    setText('love-tendency-summary-detail', data.oneWordSummaryDetail);

    // 片思いモード / ガチ恋モード
    setHtmlList('one-sided-love-mode', data.crushModeBehaviours); // 配列を期待
    setHtmlList('serious-love-mode', data.seriousLoveModeBehaviours); // 配列を期待

    // 理想のタイプ
    if (data.idealType) {
        const tagsContainer = document.getElementById('ideal-type-tags');
        if (tagsContainer && data.idealType.tags && Array.isArray(data.idealType.tags)) {
            tagsContainer.innerHTML = data.idealType.tags.map(tag =>
                `<span class="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">#${tag}</span>`
            ).join('');
        } else if (tagsContainer) {
            tagsContainer.innerHTML = '<span class="text-xs text-gray-500">情報なし</span>';
        }
        setText('ideal-type-text', data.idealType.description);
    }

    // 結婚願望
    if (data.marriageDesire) {
        const desireBar = document.getElementById('marriage-desire-bar');
        if (desireBar && data.marriageDesire.strengthValue) { // strengthValue: 0-100 の数値と仮定
            desireBar.style.width = `${data.marriageDesire.strengthValue}%`;
        } else if (desireBar) {
            desireBar.style.width = '50%'; // デフォルト
        }
        setHtmlList('ideal-family-image', data.marriageDesire.idealFamilyImage); // 配列を期待
    }

    // 推しが喜ぶ魔法の一言
    if (data.magicWordsToMakeHimHappy && Array.isArray(data.magicWordsToMakeHimHappy)) {
        const words = data.magicWordsToMakeHimHappy;
        setText('magic-word-1-phrase', words[0] ? words[0].phrase : '情報なし');
        setText('magic-word-1-detail', words[0] ? words[0].detail : '');
        setText('magic-word-2-phrase', words[1] ? words[1].phrase : '情報なし');
        setText('magic-word-2-detail', words[1] ? words[1].detail : '');
        setText('magic-word-3-phrase', words[2] ? words[2].phrase : '情報なし');
        setText('magic-word-3-detail', words[2] ? words[2].detail : '');
    }

    // 褒めて欲しいポイント
    if (data.pointsToPraise) {
        setText('praise-point-core', data.pointsToPraise.core);
        setText('praise-point-detail', data.pointsToPraise.detail);
    }

    // NG声かけワード
    if (data.ngWords) {
        const ngWordsContainer = document.getElementById('ng-words-list');
        if (ngWordsContainer && data.ngWords.words && Array.isArray(data.ngWords.words)) {
            ngWordsContainer.innerHTML = data.ngWords.words.map(word =>
                `<span class="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium">「${word}」</span>`
            ).join('');
        } else if (ngWordsContainer) {
            ngWordsContainer.innerHTML = '<span class="text-xs text-gray-500">情報なし</span>';
        }
        setText('ng-words-detail', data.ngWords.detail);
    }

    console.log('恋愛傾向タブの内容が更新されました。');
}

export function displayLoveTendency(data) {
    if (!data || !data.loveTendency) {
        console.warn('恋愛傾向データが見つかりません。', data);
        // エラー表示やデフォルト表示をここに実装することも可能
        // 例: document.getElementById('love-tendency-content').innerHTML = '<p>恋愛傾向データを読み込めませんでした。</p>';
        return;
    }

    const loveData = data.loveTendency;

    // 恋愛傾向を一言で
    document.getElementById('love-tendency-summary').textContent = loveData.loveTendencySummary || 'N/A';
    document.getElementById('love-tendency-summary-detail').textContent = loveData.loveTendencySummaryDetail || '詳細情報なし';

    // 片思いモード
    const oneSidedLoveModeUl = document.getElementById('one-sided-love-mode');
    oneSidedLoveModeUl.innerHTML = ''; //既存の項目をクリア
    if (loveData.oneSidedLoveModeBehaviors && loveData.oneSidedLoveModeBehaviors.length > 0) {
        loveData.oneSidedLoveModeBehaviors.forEach(behavior => {
            const li = document.createElement('li');
            li.textContent = behavior;
            oneSidedLoveModeUl.appendChild(li);
        });
    } else {
        oneSidedLoveModeUl.innerHTML = '<li>情報なし</li>';
    }

    // ガチ恋モード
    const seriousLoveModeUl = document.getElementById('serious-love-mode');
    seriousLoveModeUl.innerHTML = ''; //既存の項目をクリア
    if (loveData.seriousLoveModeBehaviors && loveData.seriousLoveModeBehaviors.length > 0) {
        loveData.seriousLoveModeBehaviors.forEach(behavior => {
            const li = document.createElement('li');
            li.textContent = behavior;
            seriousLoveModeUl.appendChild(li);
        });
    } else {
        seriousLoveModeUl.innerHTML = '<li>情報なし</li>';
    }

    // 理想のタイプ
    const idealTypeTagsDiv = document.getElementById('ideal-type-tags');
    idealTypeTagsDiv.innerHTML = ''; //既存の項目をクリア
    if (loveData.idealTypeTags && loveData.idealTypeTags.length > 0) {
        loveData.idealTypeTags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium';
            span.textContent = tag;
            idealTypeTagsDiv.appendChild(span);
        });
    } else {
        idealTypeTagsDiv.innerHTML = '<span class="text-xs text-gray-500">情報なし</span>';
    }
    document.getElementById('ideal-type-text').textContent = loveData.idealTypeText || '詳細情報なし';

    // 結婚願望
    const marriageDesireBar = document.getElementById('marriage-desire-bar');
    marriageDesireBar.style.width = `${loveData.marriageDesirePercentage || 0}%`;

    const idealFamilyImageUl = document.getElementById('ideal-family-image');
    idealFamilyImageUl.innerHTML = ''; //既存の項目をクリア
    if (loveData.idealFamilyImagePoints && loveData.idealFamilyImagePoints.length > 0) {
        loveData.idealFamilyImagePoints.forEach(point => {
            const li = document.createElement('li');
            li.textContent = point;
            idealFamilyImageUl.appendChild(li);
        });
    } else {
        idealFamilyImageUl.innerHTML = '<li>情報なし</li>';
    }

    // 推しが喜ぶ魔法の一言
    for (let i = 1; i <= 3; i++) {
        const magicWord = loveData.magicWordsToMakeHappy && loveData.magicWordsToMakeHappy.find(mw => mw.rank === `${i}位`);
        document.getElementById(`magic-word-${i}-phrase`).textContent = magicWord ? magicWord.phrase : 'N/A';
        document.getElementById(`magic-word-${i}-detail`).textContent = magicWord ? magicWord.detail : '詳細なし';
    }

    // 褒めて欲しいポイント
    document.getElementById('praise-point-core').textContent = loveData.praisePointCore || 'N/A';
    document.getElementById('praise-point-detail').textContent = loveData.praisePointDetail || '詳細情報なし';

    // NG声かけワード
    const ngWordsListDiv = document.getElementById('ng-words-list');
    ngWordsListDiv.innerHTML = ''; //既存の項目をクリア
    if (loveData.ngWords && loveData.ngWords.length > 0) {
        loveData.ngWords.forEach(word => {
            const span = document.createElement('span');
            span.className = 'bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium';
            span.textContent = word;
            ngWordsListDiv.appendChild(span);
        });
    } else {
        ngWordsListDiv.innerHTML = '<span class="text-xs text-gray-500">情報なし</span>';
    }
    document.getElementById('ng-words-detail').textContent = loveData.ngWordsDetail || '詳細情報なし';
}
