/**
 * 恋愛傾向タブのデータを設定するモジュール
 */

/**
 * 「恋愛傾向」タブに診断結果の恋愛関連情報を設定します。
 * @param {object} loveTendencyData - 診断結果のloveTendencyオブジェクト
 */
export function populateLoveTendencyTab(loveTendencyData) {
    console.log('populateLoveTendencyTab 実行。受け取ったデータ:', loveTendencyData);
    const contentArea = document.getElementById('love-tendency-content');

    if (!contentArea) {
        console.error('ID「love-tendency-content」の要素が見つかりません。');
        return;
    }

    if (!loveTendencyData) {
        contentArea.innerHTML = '<div class="p-4 text-gray-500">恋愛傾向データがありません。</div>';
        console.warn('恋愛傾向データ(loveTendencyData)が提供されませんでした。');
        return;
    }

    let htmlContent = '<div class="p-3 sm:p-4 space-y-4">';

    const 항목표시 = (label, value, icon = 'fa-heart', bgColor = 'bg-pink-50', textColor = 'text-pink-600') => {
        if (value === undefined || value === null || value === '') {
            console.warn(`恋愛傾向データ項目「${label}」の値がありません。`);
            // return ''; // 値がない場合は何も表示しないか、メッセージを表示するか選択
            value = '情報なし'; // デフォルト表示
        }
        return `
            <div class="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
                <h3 class="text-lg font-semibold ${textColor} mb-2">
                    <i class="fas ${icon} mr-2"></i>${label}
                </h3>
                <p class="text-gray-600 whitespace-pre-line">${value}</p>
            </div>`;
    };

    htmlContent += 항목표시('恋愛傾向 (一言で言うと)', loveTendencyData.oneWordSummary, 'fa-comment-dots');
    htmlContent += 항목표시('片思いしてる時の彼', loveTendencyData.crushMode, 'fa-user-secret');
    htmlContent += 항목표시('ガチ恋モードの彼', loveTendencyData.seriousLoveMode, 'fa-fire');
    htmlContent += 항목표시('好きなタイプ', loveTendencyData.idealType, 'fa-grin-stars');
    htmlContent += 항목표시('結婚願望', loveTendencyData.desireForMarriage, 'fa-ring');
    htmlContent += 항목표시('彼が喜ぶ魔法の一言', loveTendencyData.magicWord, 'fa-magic');
    htmlContent += 항목표시('こんなところを褒めてほしい', loveTendencyData.praisePoints, 'fa-thumbs-up');
    htmlContent += 항목표시('NGな声かけ・行動', loveTendencyData.ngActions, 'fa-hand-paper', 'bg-red-50', 'text-red-600');

    htmlContent += '</div>';
    contentArea.innerHTML = htmlContent;
    console.log('恋愛傾向タブの内容が更新されました。');
}
