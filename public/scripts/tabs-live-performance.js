/**
 * 「ライブでの輝き」タブ (旧 能力評価タブ) にライブパフォーマンスに関するヒントを表示します。
 * @param {Array<object>} livePerformanceHints - ライブパフォーマンスヒントの配列
 * 各要素は { situation: string, interpretation: string, relatedAspect: string } を持つ
 */
export function populateLivePerformanceTab(livePerformanceHints) {
    console.log('populateLivePerformanceTab 実行。受け取ったデータ:', livePerformanceHints);
    const skillsContent = document.getElementById('skills-content'); // HTMLのIDは skills-content のまま

    if (!skillsContent) {
        console.error('ID「skills-content」の要素が見つかりません。');
        return;
    }

    if (!livePerformanceHints || livePerformanceHints.length === 0) {
        skillsContent.innerHTML = '<div class="p-4 text-gray-500">ライブパフォーマンスに関するヒントはありません。</div>';
        console.warn('ライブパフォーマンスヒントデータが提供されなかったか、空です。');
        return;
    }

    let htmlContent = '<div class="p-3 sm:p-4 space-y-4">';

    livePerformanceHints.forEach((hint, index) => {
        htmlContent += `
            <div class="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
                <h4 class="text-md font-semibold text-indigo-600 mb-1">
                    <i class="fas fa-lightbulb mr-2 text-yellow-400"></i>ヒント ${index + 1}: ${hint.situation || '特定の状況'}
                </h4>
                <p class="text-gray-700 mb-2 whitespace-pre-line">${hint.interpretation || '解釈がありません'}</p>
                ${hint.relatedAspect ? `<p class="text-xs text-gray-500"><i class="fas fa-link mr-1"></i>関連する側面: ${hint.relatedAspect}</p>` : ''}
            </div>
        `;
    });

    htmlContent += '</div>';
    skillsContent.innerHTML = htmlContent;
    console.log('ライブでの輝きタブの内容が更新されました。');
}
