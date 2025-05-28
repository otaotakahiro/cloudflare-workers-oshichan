/**
 * 妄想コンテンツタブのデータを設定するモジュール
 */

/**
 * 「妄想コンテンツ」タブに診断結果の妄想系情報を設定します。
 * @param {object} data - 診断結果のfantasyContentオブジェクト
 */
export function populateFantasyContentTab(data) {
    console.log('populateFantasyContentTab 実行。データ:', data);

    if (!data) {
        console.warn('妄想コンテンツデータが提供されませんでした。');
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

    // もしも推しが一般人だったら
    if (data.ifHeWereOrdinary) {
        setText('if-ordinary-occupation', data.ifHeWereOrdinary.occupation);
        setText('if-ordinary-hobby', data.ifHeWereOrdinary.hobby);
        setText('if-ordinary-text', data.ifHeWereOrdinary.description);
    }

    // もしも推しがペットだったら
    if (data.ifHeWerePet) {
        setText('if-pet-type', data.ifHeWerePet.type);
        setText('if-pet-personality', data.ifHeWerePet.personality);
        setText('if-pet-text', data.ifHeWerePet.description);
    }

    // 密着！推しの1日の過ごし方
    if (data.dayInTheLife) {
        setText('day-in-life-morning', data.dayInTheLife.morning);
        setText('day-in-life-afternoon', data.dayInTheLife.afternoon);
        setText('day-in-life-night', data.dayInTheLife.night);
    }

    console.log('妄想コンテンツタブの内容が更新されました。');
}

export function displayFantasyContent(data) {
    if (!data || !data.fantasyContent) {
        console.warn('妄想コンテンツデータが見つかりません。', data);
        return;
    }

    const fantasyData = data.fantasyContent;

    // もしも推しが一般人だったら・・・
    document.getElementById('if-ordinary-occupation').textContent = fantasyData.ifOrdinaryOccupation || 'N/A';
    document.getElementById('if-ordinary-hobby').textContent = fantasyData.ifOrdinaryHobby || 'N/A';
    document.getElementById('if-ordinary-text').textContent = fantasyData.ifOrdinaryText || '詳細情報なし';

    // もしも推しがペットだったら・・・
    document.getElementById('if-pet-type').textContent = fantasyData.ifPetType || 'N/A';
    document.getElementById('if-pet-personality').textContent = fantasyData.ifPetPersonality || 'N/A';
    document.getElementById('if-pet-text').textContent = fantasyData.ifPetText || '詳細情報なし';

    // 密着！推しの1日の過ごし方
    document.getElementById('day-in-life-morning').textContent = fantasyData.dayInLifeMorning || '情報なし';
    document.getElementById('day-in-life-afternoon').textContent = fantasyData.dayInLifeAfternoon || '情報なし';
    document.getElementById('day-in-life-night').textContent = fantasyData.dayInLifeNight || '情報なし';
}
