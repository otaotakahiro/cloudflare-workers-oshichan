/**
 * 性格・運勢タブのデータを設定するモジュール
 */

/**
 * 「性格・運勢」タブに診断結果の基本情報を設定します。
 * @param {object} baseDiagnosis - 診断結果のbaseオブジェクト
 */
export function populatePersonalityFortuneTab(baseDiagnosis) {
    console.log('populatePersonalityFortuneTab 実行。受け取ったデータ:', baseDiagnosis);
    const contentArea = document.getElementById('personality-fortune-content');

    if (!contentArea) {
        console.error('ID「personality-fortune-content」の要素が見つかりません。');
        return;
    }

    if (!baseDiagnosis) {
        contentArea.innerHTML = '<div class="p-4 text-gray-500">性格・運勢データがありません。</div>';
        console.warn('性格・運勢データ(baseDiagnosis)が提供されませんでした。');
        return;
    }

    let htmlContent = '<div class="p-3 sm:p-4 space-y-4">';

    // 表示するデータのキーと日本語ラベルのマッピング
    // publicPersona, privatePersona, mentalAspects, socialStance, lyingHabits, importantThingsInLifeTop3, currentFortune, futureTurningPoint, livePerformanceHints
    const displayItems = [
        { key: 'publicPersona', label: '表の顔 (Public Persona)', icon: 'fa-theater-masks' },
        { key: 'privatePersona', label: '裏の顔 (Private Persona)', icon: 'fa-user-secret' },
        {
            key: 'mentalAspects',
            label: 'メンタル傾向',
            icon: 'fa-brain',
            isObject: true,
            subKeys: [
                { key: 'strength', label: '強み' },
                { key: 'weakness', label: '弱み' },
                { key: 'copingWithWeakness', label: '弱さとの向き合い方' },
                { key: 'getDepressedEasily', label: '落ち込みやすさ' },
                { key: 'tryToBeStrong', label: '強がり度' }, // UIに合わせて調整
                { key: 'emotionalUpsAndDowns', label: '感情の起伏' },
                { key: 'howToRecover', label: '立ち直り方' },
                { key: 'fanSupportHint', label: 'ファンへのヒント' }
            ]
        },
        {
            key: 'socialStance',
            label: '人付き合いのスタンス',
            icon: 'fa-users',
            isObject: true,
            subKeys: [
                { key: 'description', label: '基本スタンス' },
                { key: 'extrovertOrIntrovert', label: '外交性／内向性' },
                { key: 'solitaryOrGroup', label: '単独行動／集団行動' },
                { key: 'roleInGroup', label: 'グループでの役割' },
                { key: 'timeToOpenUp', label: '心を開くまでの時間' },
                { key: 'snsBehaviorHint', label: 'SNSなどでの振る舞いヒント' }
            ]
        },
        { key: 'lyingHabits', label: '嘘のつき方・癖', icon: 'fa-comment-slash' },
    ];

    displayItems.forEach(item => {
        const value = baseDiagnosis[item.key];
        if (value === undefined) {
            console.warn(`キー「${item.key}」のデータが baseDiagnosis に存在しません。`);
            // オプション：項目自体をスキップするか、明示的に「情報なし」と表示するか
            // htmlContent += `... 情報がありません ...`;
            return; // スキップする場合
        }
        htmlContent += `
            <div class="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
                <h3 class="text-lg font-semibold text-gray-700 mb-2">
                    <i class="fas ${item.icon || 'fa-question-circle'} mr-2 text-blue-500"></i>${item.label}
                </h3>`;
        if (item.isObject && typeof value === 'object' && value !== null) {
            item.subKeys.forEach(subItem => {
                const subValue = value[subItem.key];
                 if (subValue !== undefined) {
                    htmlContent += `
                        <div class="mt-2">
                            <h4 class="text-md font-semibold text-gray-600 mb-1">${subItem.label}</h4>
                            <p class="text-gray-600 whitespace-pre-line">${subValue || '情報なし'}</p>
                        </div>`;
                } else {
                     console.warn(`サブキー「${item.key}.${subItem.key}」のデータが存在しません。`);
                     htmlContent += `
                        <div class="mt-2">
                            <h4 class="text-md font-semibold text-gray-500 mb-1">${subItem.label}</h4>
                            <p class="text-gray-400 italic">情報がありません</p>
                        </div>`;
                }
            });
        } else if (value) {
            htmlContent += `<p class="text-gray-600 whitespace-pre-line">${value}</p>`;
        } else {
            htmlContent += `<p class="text-gray-400 italic">情報がありません</p>`;
        }
        htmlContent += `</div>`;
    });

    // 人生で大切なことTOP3
    if (baseDiagnosis.importantThingsInLifeTop3 && Array.isArray(baseDiagnosis.importantThingsInLifeTop3)) {
        htmlContent += `
            <div class="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
                <h3 class="text-lg font-semibold text-gray-700 mb-2"><i class="fas fa-gem mr-2 text-purple-500"></i>人生で大切にしていることTOP3</h3>`;
        baseDiagnosis.importantThingsInLifeTop3.forEach(thing => {
            htmlContent += `
                <div class="mt-3">
                    <h4 class="text-md font-semibold text-purple-600 mb-1">${thing.rank}位: ${thing.title || 'タイトルなし'}</h4>
                    <p class="text-gray-600 whitespace-pre-line">${thing.description || '詳細情報なし'}</p>
                </div>`;
        });
        htmlContent += `</div>`;
    }

    // 今の運気 & 今後の転機 (1つのカードにまとめることも検討)
    if (baseDiagnosis.currentFortune) {
        const cf = baseDiagnosis.currentFortune;
        htmlContent += `
            <div class="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
                <h3 class="text-lg font-semibold text-gray-700 mb-2"><i class="fas fa-chart-line mr-2 text-green-500"></i>今の運気 (${cf.period || '時期不明'})</h3>
                <p class="text-gray-600 whitespace-pre-line mb-2"><strong>全体:</strong> ${cf.overallText || '情報なし'}</p>
                <p class="text-gray-600 whitespace-pre-line mb-1"><strong>仕事:</strong> ${cf.workLuck || '情報なし'}</p>
                <p class="text-gray-600 whitespace-pre-line mb-1"><strong>金運:</strong> ${cf.moneyLuck || '情報なし'}</p>
                <p class="text-gray-600 whitespace-pre-line"><strong>恋愛:</strong> ${cf.loveLuck || '情報なし'}</p>
            </div>`;
    }
    if (baseDiagnosis.futureTurningPoint) {
        const ftp = baseDiagnosis.futureTurningPoint;
        htmlContent += `
            <div class="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
                <h3 class="text-lg font-semibold text-gray-700 mb-2"><i class="fas fa-directions mr-2 text-teal-500"></i>今後の転機 (${ftp.timing || '時期未定'})</h3>
                <p class="text-gray-600 whitespace-pre-line mb-2">${ftp.description || '詳細情報なし'}</p>
                ${ftp.growthPoints && ftp.growthPoints.length > 0 ?
                    `<div><h4 class="text-md font-semibold text-teal-600 mb-1">成長のポイント:</h4><ul class="list-disc list-inside text-gray-600">${ftp.growthPoints.map(p => `<li>${p}</li>`).join('')}</ul></div>`
                    : ''
                }
            </div>`;
    }

    // ライブパフォーマンスヒント
    if (baseDiagnosis.livePerformanceHints && Array.isArray(baseDiagnosis.livePerformanceHints)) {
        htmlContent += `
            <div class="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
                <h3 class="text-lg font-semibold text-gray-700 mb-2"><i class="fas fa-microphone-alt mr-2 text-orange-500"></i>ライブでの輝きヒント</h3>`;
        baseDiagnosis.livePerformanceHints.forEach((hint, index) => {
             htmlContent += `
                <div class="mt-3">
                    <h4 class="text-md font-semibold text-orange-600 mb-1"><i class="fas fa-lightbulb mr-1 text-yellow-400"></i>ヒント ${index + 1}: ${hint.situation || '特定の状況'}</h4>
                    <p class="text-gray-700 mb-1 whitespace-pre-line">${hint.interpretation || '解釈がありません'}</p>
                    ${hint.relatedAspect ? `<p class="text-xs text-gray-500"><i class="fas fa-link mr-1"></i>関連する側面: ${hint.relatedAspect}</p>` : ''}
                </div>`;
        });
        htmlContent += `</div>`;
    }

    htmlContent += '</div>'; // 全体コンテナを閉じる
    contentArea.innerHTML = htmlContent;
    console.log('性格・運勢タブの内容が更新されました。');
}

// 以前の populateStrengths, populateWeaknesses などは削除（populatePersonalityFortuneTabに統合 or 不要のため）
