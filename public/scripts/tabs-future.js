/**
 * 未来予測タブ用の表示処理
 */

/**
 * 未来予測タブのデータを表示
 * @param {Object} future - 未来予測データ
 */
export function populateFutureTab(future) {
  if (!future) return;

  console.log('未来予測タブの表示処理を開始');

  // タイムライン表示
  populateTimeline(future.timeline);

  // キャリア提案表示
  populateCareerProposals(future.careerProposals);

  console.log('未来予測タブの表示処理が完了');
}

/**
 * タイムラインの表示
 * @param {Array} timeline - タイムラインの配列
 */
function populateTimeline(timeline) {
  if (!timeline || !timeline.length) {
    console.warn('タイムラインデータがありません');
    return;
  }

  const container = document.getElementById('timeline-container');
  if (!container) {
    console.error('タイムラインコンテナが見つかりません: timeline-container');
    return;
  }

  console.log('タイムラインコンテナを取得しました。コンテンツをクリアします');

  // コンテナをクリア
  container.innerHTML = '';

  // タイムラインのコンテナを作成
  const timelineContainer = document.createElement('div');
  timelineContainer.className = 'relative';

  // 垂直線を作成
  const verticalLine = document.createElement('div');
  verticalLine.className = 'absolute left-10 top-0 bottom-0 w-0.5 bg-green-200';
  verticalLine.style.height = '100%';
  verticalLine.style.zIndex = '1';
  timelineContainer.appendChild(verticalLine);

  // タイムラインアイテムを追加
  timeline.forEach((item, index) => {
    // 期間によって色を変える
    let colorClass;
    let bgColorClass;
    switch (item.term) {
      case '短期':
        colorClass = 'text-blue-600';
        bgColorClass = 'bg-blue-100';
        break;
      case '中期':
        colorClass = 'text-green-600';
        bgColorClass = 'bg-green-100';
        break;
      case '中長期':
        colorClass = 'text-yellow-600';
        bgColorClass = 'bg-yellow-100';
        break;
      case '長期':
        colorClass = 'text-purple-600';
        bgColorClass = 'bg-purple-100';
        break;
      default:
        colorClass = 'text-gray-800';
        bgColorClass = 'bg-gray-100';
    }

    const timelineItem = document.createElement('div');
    timelineItem.className = 'relative flex items-start mb-8 pl-12';

    // 期間と内容のコンテナ
    const contentContainer = document.createElement('div');
    contentContainer.className = 'flex-grow ml-4';

    // 期間表示 - Positioned over the line
    const periodBadge = document.createElement('div');
    // Added positioning styles, z-index, and background
    periodBadge.className = `absolute left-10 transform -translate-x-1/2 z-20 py-1 px-3 rounded-md text-xs font-semibold shadow-sm ${bgColorClass} ${colorClass}`;
    periodBadge.textContent = item.period;

    // フェーズのタイトル
    const phaseTitle = document.createElement('h4');
    phaseTitle.className = 'text-lg font-bold mb-1 timeline-phase-title';
    phaseTitle.textContent = item.phase;

    // 説明テキスト
    const description = document.createElement('div');
    description.className = 'bg-white p-4 border rounded-md shadow-sm';
    description.textContent = item.description;

    // 要素を組み立て
    // Append badge directly to timelineItem to position relative to it
    timelineItem.appendChild(periodBadge);
    // contentContainer no longer needs margin adjustment based on circle
    contentContainer.appendChild(phaseTitle);
    contentContainer.appendChild(description);

    timelineItem.appendChild(contentContainer);

    timelineContainer.appendChild(timelineItem);
  });

  container.appendChild(timelineContainer);

  console.log('タイムラインの表示を完了しました');
}

/**
 * キャリア提案の表示
 * @param {Array} proposals - キャリア提案の配列
 */
function populateCareerProposals(proposals) {
  if (!proposals || !proposals.length) {
    console.warn('キャリア提案データがありません');
    return;
  }

  const container = document.getElementById('career-proposals-container');
  if (!container) {
    console.error('キャリア提案コンテナが見つかりません: career-proposals-container');
    return;
  }

  console.log('キャリア提案コンテナを取得しました。コンテンツをクリアします');

  // コンテナをクリア
  container.innerHTML = '';

  proposals.forEach(proposal => {
    const proposalItem = document.createElement('div');
    proposalItem.className = 'border rounded-lg p-5 mb-5 shadow-sm';

    // アイコンによって色を変える
    const colorClass = getColorByIcon(proposal.icon);
    const iconClass = getIconClass(proposal.icon);

    // タイトル部分
    const titleSection = document.createElement('div');
    titleSection.className = `text-lg font-bold mb-3 p-2 rounded-md bg-${colorClass}-50 text-${colorClass}-700 inline-block`;
    titleSection.innerHTML = `<i class="fas fa-${iconClass} mr-2"></i>${proposal.term}：${proposal.title}`;

    proposalItem.appendChild(titleSection);

    // アクションリスト
    if (proposal.actions && proposal.actions.length) {
      const actionsList = document.createElement('ul');
      actionsList.className = 'space-y-2 ml-6 list-disc';

      proposal.actions.forEach(action => {
        const listItem = document.createElement('li');
        listItem.className = 'text-sm';
        listItem.textContent = action;
        actionsList.appendChild(listItem);
      });

      proposalItem.appendChild(actionsList);
    }

    container.appendChild(proposalItem);
  });

  console.log('キャリア提案の表示を完了しました');
}

/**
 * アイコン名からFontAwesomeのアイコンクラスを取得
 * @param {string} icon - アイコン名
 * @return {string} FontAwesomeのアイコンクラス
 */
function getIconClass(icon) {
  const iconMap = {
    'rocket': 'rocket',
    'chart-line': 'chart-line',
    'mountain': 'mountain'
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
    'rocket': 'blue',
    'chart-line': 'green',
    'mountain': 'indigo'
  };

  return colorMap[icon] || 'blue'; // デフォルトは青
}
