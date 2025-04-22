/**
 * キャリア適性タブ用の表示処理
 */

/**
 * キャリア適性タブのデータを表示
 * @param {Object} career - キャリアデータ
 */
export function populateCareerTab(career) {
  if (!career) return;

  // 適性スコアと新規事業領域を横並びにするためのグリッドを作成
  createTopGrid(career.aptitudeScores, career.businessAreas, career.successKeywords);

  // 適性フィールド表示
  populateSuitableFields(career.suitableFields);
}

/**
 * 適性スコアと新規事業領域を横並びに表示し、キーワードをその下に表示するグリッドを作成
 * @param {Array} scores - 適性スコアの配列
 * @param {Array} areas - 事業領域の配列
 * @param {Array} keywords - キーワードの配列
 */
function createTopGrid(scores, areas, keywords) {
  // キャリア適性タブのコンテナを取得
  const careerContent = document.getElementById('career-content');
  if (!careerContent) return;

  // 既存のタイトル要素を保持
  const h2Title = careerContent.querySelector('h2');

  // 各セクションを取得
  const scoresSection = careerContent.querySelector('.mb-10:nth-child(2)');
  const areasSection = careerContent.querySelector('.mb-10:nth-child(3)');
  const keywordsSection = careerContent.querySelector('.mb-10:nth-child(4)');
  const fieldsSection = careerContent.querySelector('.mb-10:nth-child(5)');

  if (!scoresSection || !areasSection || !keywordsSection) return;

  // 既存のセクションを削除（スコア、事業領域、キーワードのみ）
  careerContent.removeChild(scoresSection);
  careerContent.removeChild(areasSection);
  careerContent.removeChild(keywordsSection);

  // タイトルの後に新しいコンテナを作成
  const newContainer = document.createElement('div');
  newContainer.className = 'mb-10';

  if (h2Title) {
    h2Title.insertAdjacentElement('afterend', newContainer);
  } else {
    careerContent.prepend(newContainer);
  }

  // 1. 適性スコアと新規事業領域を横並びにするグリッドを作成
  const topGridContainer = document.createElement('div');
  topGridContainer.className = 'grid grid-cols-1 md:grid-cols-2 gap-6 mb-6';
  newContainer.appendChild(topGridContainer);

  // グリッドコンテナに適性スコアと新規事業領域のセクションを追加
  topGridContainer.appendChild(scoresSection);
  topGridContainer.appendChild(areasSection);

  // 2. キャリア成功のキーワードをその下に配置
  newContainer.appendChild(keywordsSection);

  // 適性スコア表示
  populateAptitudeScores(scores);

  // 新規事業領域表示
  populateBusinessAreas(areas);

  // キャリア成功のキーワード表示
  populateSuccessKeywords(keywords);
}

/**
 * 適性スコアの表示
 * @param {Array} scores - 適性スコアの配列
 */
function populateAptitudeScores(scores) {
  if (!scores || !scores.length) return;

  const container = document.getElementById('aptitude-scores-container');
  if (!container) return;

  container.innerHTML = '';

  scores.forEach(score => {
    const scoreItem = document.createElement('div');
    scoreItem.className = 'border rounded-lg p-4 mb-4';

    const progressValue = score.score / 100 * 100; // スコアを0-100%に変換

    scoreItem.innerHTML = `
      <div class="flex justify-between items-center mb-2">
        <span class="font-bold">${score.field}</span>
        <span class="font-bold text-blue-600">${score.score}点</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${progressValue}%"></div>
      </div>
    `;

    container.appendChild(scoreItem);
  });
}

/**
 * 新規事業領域の表示
 * @param {Array} areas - 事業領域の配列
 */
function populateBusinessAreas(areas) {
  if (!areas || !areas.length) return;

  const container = document.getElementById('business-areas-container');
  if (!container) return;

  container.innerHTML = '';

  areas.forEach(area => {
    const areaItem = document.createElement('div');
    areaItem.className = 'border rounded-lg p-4 mb-4';

    // タグを生成
    const tagsHtml = area.tags ? area.tags.map(tag =>
      `<span class="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs">${tag}</span>`
    ).join('') : '';

    // アイコンのマッピング
    const iconClass = getIconClass(area.icon);

    areaItem.innerHTML = `
      <div class="flex items-center mb-2">
        <div class="text-${getColorByIcon(area.icon)}-500 mr-2"><i class="fas fa-${iconClass}"></i></div>
        <h4 class="font-bold">${area.name}</h4>
      </div>
      <p class="text-sm mb-3">${area.description}</p>
      <div class="flex flex-wrap gap-2">
        ${tagsHtml}
      </div>
    `;

    container.appendChild(areaItem);
  });
}

/**
 * キャリア成功のキーワード表示
 * @param {Array} keywords - キーワードの配列
 */
function populateSuccessKeywords(keywords) {
  if (!keywords || !keywords.length) return;

  const container = document.getElementById('success-keywords-container');
  if (!container) return;

  // コンテナをクリア
  container.innerHTML = '';

  // グリッドレイアウトを作成
  const keywordsGrid = document.createElement('div');
  keywordsGrid.className = 'grid grid-cols-1 md:grid-cols-3 gap-4';

  keywords.forEach(keyword => {
    const keywordItem = document.createElement('div');
    keywordItem.className = `bg-${getColorByIcon(keyword.icon)}-50 rounded-lg p-4`;

    // アイコンのマッピング
    const iconClass = getIconClass(keyword.icon);

    keywordItem.innerHTML = `
      <div class="flex items-center mb-2">
        <div class="text-${getColorByIcon(keyword.icon)}-500 mr-2"><i class="fas fa-${iconClass}"></i></div>
        <h4 class="font-bold">${keyword.title}</h4>
      </div>
      <p class="text-sm">${keyword.description}</p>
    `;

    keywordsGrid.appendChild(keywordItem);
  });

  container.appendChild(keywordsGrid);
}

/**
 * 適性フィールド表示
 * @param {Array} fields - フィールドの配列
 */
function populateSuitableFields(fields) {
  if (!fields || !fields.length) return;

  const container = document.getElementById('suitable-fields-container');
  if (!container) return;

  container.innerHTML = '';

  fields.forEach((field, index) => {
    const fieldItem = document.createElement('div');
    fieldItem.className = 'mb-5 border-b pb-5';
    if (index === fields.length - 1) {
      fieldItem.classList.remove('border-b');
    }

    fieldItem.innerHTML = `
      <h3 class="text-lg font-bold mb-2">${field.name}</h3>
      <p class="text-sm text-gray-600 mb-2">${field.examples}</p>
      <p class="text-sm">${field.description}</p>
    `;

    container.appendChild(fieldItem);
  });
}

/**
 * アイコン名からFontAwesomeのアイコンクラスを取得
 * @param {string} icon - アイコン名
 * @return {string} FontAwesomeのアイコンクラス
 */
function getIconClass(icon) {
  const iconMap = {
    'lightbulb': 'lightbulb',
    'graduation-cap': 'graduation-cap',
    'heart': 'heart',
    'map-marker-alt': 'map-marker-alt',
    'chart-line': 'chart-line',
    'hands-helping': 'hands-helping',
    'balance-scale': 'balance-scale',
    'mountain': 'mountain',
    'rocket': 'rocket'
  };

  return iconMap[icon] || 'circle'; // デフォルトはサークル
}

/**
 * アイコン名から色を決定
 * @param {string} icon - アイコン名
 * @return {string} Tailwind CSSの色クラス
 */
function getColorByIcon(icon) {
  const colorMap = {
    'lightbulb': 'yellow',
    'graduation-cap': 'green',
    'heart': 'purple',
    'map-marker-alt': 'red',
    'chart-line': 'blue',
    'hands-helping': 'purple',
    'balance-scale': 'green',
    'mountain': 'indigo',
    'rocket': 'orange'
  };

  return colorMap[icon] || 'blue'; // デフォルトは青
}
