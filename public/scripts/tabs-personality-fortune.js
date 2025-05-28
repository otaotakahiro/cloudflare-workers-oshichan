/**
 * 性格・運勢タブのデータを設定するモジュール
 */

/**
 * 「性格・運勢」タブに診断結果の基本情報を設定します。
 * @param {object} data - 診断結果のデータ
 */
export function populatePersonalityFortuneTab(data) {
    console.log('populatePersonalityFortuneTab 実行。データ:', data);

    if (!data) {
        console.warn('性格・運勢データが提供されませんでした。');
        // ここでタブ内にエラーメッセージを表示するなどの処理も可能
        return;
    }

    // ヘルパー関数: 要素にテキストを設定。存在しない場合は警告。
    const setText = (id, text) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text || '情報なし';
        } else {
            console.warn(`Element with ID '${id}' not found.`);
        }
    };

    const setHtml = (id, html) => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = html || '<p>情報なし</p>';
        } else {
            console.warn(`Element with ID '${id}' not found.`);
        }
    };

    // 推しの表の顔・裏の顔
    setText('public-persona', data.publicPersona);
    setText('private-persona', data.privatePersona);

    // メンタルの強さ
    if (data.mentalAspects) {
        setText('mental-strength-text', data.mentalAspects.description); // 仮のキー名
        const strengthBar = document.getElementById('mental-strength-bar');
        if (strengthBar && data.mentalAspects.strengthValue) { // strengthValue: 0-100 の数値と仮定
            strengthBar.style.width = `${data.mentalAspects.strengthValue}%`;
        } else if (strengthBar) {
            strengthBar.style.width = '50%'; // デフォルト
        }
    }

    // 人付き合いのスタンス
    setText('social-stance', data.socialStance ? data.socialStance.description : ''); // 仮のキー名

    // 人生で大切にしていることTOP3
    if (data.importantThingsInLifeTop3 && Array.isArray(data.importantThingsInLifeTop3)) {
        setText('important-thing-1', data.importantThingsInLifeTop3[0] ? data.importantThingsInLifeTop3[0].title : '情報なし');
        setText('important-thing-2', data.importantThingsInLifeTop3[1] ? data.importantThingsInLifeTop3[1].title : '情報なし');
        setText('important-thing-3', data.importantThingsInLifeTop3[2] ? data.importantThingsInLifeTop3[2].title : '情報なし');
    }

    // 今の運気
    if (data.currentFortune) {
        setText('current-fortune-period', data.currentFortune.period);
        setText('current-fortune-text', data.currentFortune.overallText);
    }

    // 今後の転機
    if (data.futureTurningPoint) {
        setText('future-turning-point-period', data.futureTurningPoint.timing);
        setText('future-turning-point-text', data.futureTurningPoint.description);
        const growthPointsList = document.getElementById('growth-points-list');
        if (growthPointsList && data.futureTurningPoint.growthPoints && Array.isArray(data.futureTurningPoint.growthPoints)) {
            growthPointsList.innerHTML = data.futureTurningPoint.growthPoints.map(point => `<li>${point}</li>`).join('');
        } else if (growthPointsList) {
            growthPointsList.innerHTML = '<li>情報なし</li>';
        }
    }
    console.log('性格・運勢タブの内容が更新されました。');
}

// 以前の populateStrengths, populateWeaknesses などは削除（populatePersonalityFortuneTabに統合 or 不要のため）
