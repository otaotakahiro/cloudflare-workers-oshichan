/**
 * 妄想コンテンツタブのデータを設定するモジュール
 */

/**
 * 「妄想コンテンツ」タブに診断結果の妄想系情報を設定します。
 * @param {object} fantasyContentData - 診断結果のfantasyContentオブジェクト
 */
export function populateFantasyContentTab(fantasyContentData) {
    console.log('populateFantasyContentTab 実行。受け取ったデータ:', fantasyContentData);
    const contentArea = document.getElementById('fantasy-content-content');

    if (!contentArea) {
        console.error('ID「fantasy-content-content」の要素が見つかりません。');
        return;
    }

    if (!fantasyContentData) {
        contentArea.innerHTML = '<div class="p-4 text-gray-500">妄想コンテンツデータがありません。</div>';
        console.warn('妄想コンテンツデータ(fantasyContentData)が提供されませんでした。');
        return;
    }

    let htmlContent = '<div class="p-3 sm:p-4 space-y-4">';

    const 항목표시 = (label, value, icon = 'fa-question-circle', bgColor = 'bg-purple-50', textColor = 'text-purple-600') => {
        if (value === undefined || value === null || value === '') {
            console.warn(`妄想コンテンツデータ項目「${label}」の値がありません。`);
            value = '情報なし';
        }
        return `
            <div class="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
                <h3 class="text-lg font-semibold ${textColor} mb-2">
                    <i class="fas ${icon} mr-2"></i>${label}
                </h3>
                <p class="text-gray-600 whitespace-pre-line">${value}</p>
            </div>`;
    };

    htmlContent += 항목표시('もしも推しが一般人だったら', fantasyContentData.ifOrdinaryPerson, 'fa-user-tie');
    htmlContent += 항목표시('もしも推しがあなたのペットだったら', fantasyContentData.ifPet, 'fa-paw');
    htmlContent += 항목표시('密着！推しの理想の1日の過ごし方', fantasyContentData.idealDay, 'fa-clock');
    // htmlContent += 항목표시('他にもヒント', fantasyContentData.otherHints, 'fa-lightbulb'); // 「他にもヒント」は含めない

    htmlContent += '</div>';
    contentArea.innerHTML = htmlContent;
    console.log('妄想コンテンツタブの内容が更新されました。');
}
