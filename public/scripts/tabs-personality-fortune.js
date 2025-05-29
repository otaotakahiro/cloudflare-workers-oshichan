/**
 * 性格・運勢タブのデータを設定するモジュール
 */

/**
 * 「性格・運勢」タブに診断結果の基本情報を設定します。
 * @param {object} data - 診断結果のデータ
 */
export function populatePersonalityFortuneTab(data) {
    console.log('populatePersonalityFortuneTab 実行。データ:', data);

    const personalityData = data && data.personalityFortune ? data.personalityFortune : null;

    if (!personalityData) {
        console.warn('性格・運勢データ (personalityFortune) が提供されませんでした。');
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
    setText('public-persona', personalityData.publicPersona);
    setText('private-persona', personalityData.privatePersona);

    // メンタルの強さ
    if (personalityData.mentalAspects) {
        setText('mental-strength-text', personalityData.mentalAspects.description);
        const strengthBar = document.getElementById('mental-strength-bar');
        if (strengthBar && personalityData.mentalAspects.strengthValue) { // strengthValue: 0-100 の数値と仮定
            strengthBar.style.width = `${personalityData.mentalAspects.strengthValue}%`;
        } else if (strengthBar) {
            strengthBar.style.width = '50%'; // デフォルト
        }
    }

    // 人付き合いのスタンス
    setText('social-stance', personalityData.socialStance ? personalityData.socialStance.description : '');

    // 人生で大切にしていることTOP3
    if (personalityData.importantThingsInLifeTop3 && Array.isArray(personalityData.importantThingsInLifeTop3)) {
        setText('important-thing-1', personalityData.importantThingsInLifeTop3[0] ? personalityData.importantThingsInLifeTop3[0].title : '情報なし');
        setText('important-thing-2', personalityData.importantThingsInLifeTop3[1] ? personalityData.importantThingsInLifeTop3[1].title : '情報なし');
        setText('important-thing-3', personalityData.importantThingsInLifeTop3[2] ? personalityData.importantThingsInLifeTop3[2].title : '情報なし');
    }

    // 今の運気
    if (personalityData.currentFortune) {
        setText('current-fortune-period', personalityData.currentFortune.period);
        setText('current-fortune-text', personalityData.currentFortune.overallText);
    }

    // 今後の転機 (コメントアウトされているが、もし復活させるなら personalityData を参照)
    if (personalityData.futureTurningPoint) {
        setText('future-turning-point-period', personalityData.futureTurningPoint.timing);
        setText('future-turning-point-text', personalityData.futureTurningPoint.description);
        const growthPointsList = document.getElementById('growth-points-list');
        if (growthPointsList && personalityData.futureTurningPoint.growthPoints && Array.isArray(personalityData.futureTurningPoint.growthPoints)) {
            growthPointsList.innerHTML = personalityData.futureTurningPoint.growthPoints.map(point => `<li>${point}</li>`).join('');
        } else if (growthPointsList) {
            growthPointsList.innerHTML = '<li>情報なし</li>';
        }
    }

    // livePerformanceHints の表示ロジックをここに追加する必要があるかもしれません。
    // 例:
    // const hintsContainer = document.getElementById('live-performance-hints-container');
    // if (hintsContainer && personalityData.livePerformanceHints && Array.isArray(personalityData.livePerformanceHints)) {
    //     hintsContainer.innerHTML = personalityData.livePerformanceHints.map(hint => `<div class="hint-item">${hint}</div>`).join('');
    // } else if (hintsContainer) {
    //     hintsContainer.innerHTML = '<p>ライブパフォーマンスのヒントはありません。</p>';
    // }

    console.log('性格・運勢タブの内容が更新されました。');
}

// 以前の populateStrengths, populateWeaknesses などは削除（populatePersonalityFortuneTabに統合 or 不要のため）
