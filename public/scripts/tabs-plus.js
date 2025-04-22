/**
 * プラスオンタブ用の表示処理
 */

/**
 * プラスオンタブのデータを表示
 * @param {Object} plus - プラスオンデータ
 */
export function populatePlusTab(plus) {
  if (!plus) {
    console.warn('プラスオンデータがありません');
    return;
  }

  console.log('プラスオンタブの表示処理を開始');

  // 上司としての接し方表示
  populateAsBossSection(plus.asBoss);

  // 部下としての接し方表示
  populateAsSubordinateSection(plus.asSubordinate);

  // リーダーとしてのアプローチ表示
  populateAsLeaderSection(plus.asLeader);

  console.log('プラスオンタブの表示処理が完了');
}

/**
 * 上司としての接し方セクションを表示
 * @param {Object} asBoss - 上司としての接し方データ
 */
function populateAsBossSection(asBoss) {
  if (!asBoss) {
    console.warn('上司としての接し方データがありません');
    return;
  }

  const container = document.getElementById('as-boss-container');
  if (!container) {
    console.error('上司としての接し方コンテナが見つかりません: as-boss-container');
    return;
  }

  console.log('上司としての接し方コンテナを取得しました。コンテンツをクリアします');

  // コンテナをクリア
  container.innerHTML = '';

  // 効果的なコミュニケーション方法
  if (asBoss.effectiveCommunication && asBoss.effectiveCommunication.length) {
    const commContainer = document.createElement('div');
    commContainer.className = 'mb-6';

    commContainer.innerHTML = `
      <h3 class="text-xl font-bold mb-4 flex items-center">
        <i class="fas fa-comment-alt text-blue-500 mr-2"></i>効果的なコミュニケーション
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${asBoss.effectiveCommunication.map(item => `
          <div class="border rounded-lg p-4">
            <h4 class="font-bold mb-2">${item.title}</h4>
            <p class="text-sm">${item.description}</p>
          </div>
        `).join('')}
      </div>
    `;

    container.appendChild(commContainer);
  }

  // 注意サイン
  if (asBoss.warningSignals && asBoss.warningSignals.length) {
    const warningContainer = document.createElement('div');
    warningContainer.className = 'mb-6';

    warningContainer.innerHTML = `
      <h3 class="text-xl font-bold mb-4 flex items-center">
        <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>注意サイン
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${asBoss.warningSignals.map(item => `
          <div class="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
            <h4 class="font-bold mb-2 text-yellow-700">${item.title}</h4>
            <p class="text-sm">${item.description}</p>
          </div>
        `).join('')}
      </div>
    `;

    container.appendChild(warningContainer);
  }

  console.log('上司としての接し方セクションの表示を完了しました');
}

/**
 * 部下としての接し方セクションを表示
 * @param {Object} asSubordinate - 部下としての接し方データ
 */
function populateAsSubordinateSection(asSubordinate) {
  if (!asSubordinate) {
    console.warn('部下としての接し方データがありません');
    return;
  }

  const container = document.getElementById('as-subordinate-container');
  if (!container) {
    console.error('部下としての接し方コンテナが見つかりません: as-subordinate-container');
    return;
  }

  console.log('部下としての接し方コンテナを取得しました。コンテンツをクリアします');

  // コンテナをクリア
  container.innerHTML = '';

  // 効果的なアプローチ
  if (asSubordinate.effectiveApproach && asSubordinate.effectiveApproach.length) {
    const approachContainer = document.createElement('div');
    approachContainer.className = 'mb-6';

    approachContainer.innerHTML = `
      <h3 class="text-xl font-bold mb-4 flex items-center">
        <i class="fas fa-hands-helping text-green-500 mr-2"></i>効果的なアプローチ
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${asSubordinate.effectiveApproach.map(item => `
          <div class="border rounded-lg p-4">
            <h4 class="font-bold mb-2">${item.title}</h4>
            <p class="text-sm">${item.description}</p>
          </div>
        `).join('')}
      </div>
    `;

    container.appendChild(approachContainer);
  }

  // 注意サイン
  if (asSubordinate.warningSignals && asSubordinate.warningSignals.length) {
    const warningContainer = document.createElement('div');
    warningContainer.className = 'mb-6';

    warningContainer.innerHTML = `
      <h3 class="text-xl font-bold mb-4 flex items-center">
        <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>注意サイン
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${asSubordinate.warningSignals.map(item => `
          <div class="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
            <h4 class="font-bold mb-2 text-yellow-700">${item.title}</h4>
            <p class="text-sm">${item.description}</p>
          </div>
        `).join('')}
      </div>
    `;

    container.appendChild(warningContainer);
  }

  console.log('部下としての接し方セクションの表示を完了しました');
}

/**
 * リーダーとしてのアプローチセクションを表示
 * @param {Object} asLeader - リーダーとしてのアプローチデータ
 */
function populateAsLeaderSection(asLeader) {
  if (!asLeader) {
    console.warn('リーダーとしてのアプローチデータがありません');
    return;
  }

  const container = document.getElementById('as-leader-container');
  if (!container) {
    console.error('リーダーとしてのアプローチコンテナが見つかりません: as-leader-container');
    return;
  }

  console.log('リーダーとしてのアプローチコンテナを取得しました。コンテンツをクリアします');

  // コンテナをクリア
  container.innerHTML = '';

  // 目標設定
  if (asLeader.goalDirections && asLeader.goalDirections.length) {
    const goalContainer = document.createElement('div');
    goalContainer.className = 'mb-6';

    goalContainer.innerHTML = `
      <h3 class="text-xl font-bold mb-4 flex items-center">
        <i class="fas fa-bullseye text-red-500 mr-2"></i>効果的な目標設定
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${asLeader.goalDirections.map(item => `
          <div class="border rounded-lg p-4">
            <h4 class="font-bold mb-2">${item.title}</h4>
            <p class="text-sm">${item.description}</p>
          </div>
        `).join('')}
      </div>
    `;

    container.appendChild(goalContainer);
  }

  // チーム編成
  if (asLeader.teamComposition && asLeader.teamComposition.length) {
    const teamContainer = document.createElement('div');
    teamContainer.className = 'mb-6';

    teamContainer.innerHTML = `
      <h3 class="text-xl font-bold mb-4 flex items-center">
        <i class="fas fa-users text-blue-500 mr-2"></i>理想的なチーム編成
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${asLeader.teamComposition.map(item => `
          <div class="border rounded-lg p-4">
            <h4 class="font-bold mb-2">${item.title}</h4>
            <p class="text-sm">${item.description}</p>
          </div>
        `).join('')}
      </div>
    `;

    container.appendChild(teamContainer);
  }

  console.log('リーダーとしてのアプローチセクションの表示を完了しました');
}
