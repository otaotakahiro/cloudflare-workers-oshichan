document.addEventListener('DOMContentLoaded', function() {
    // タブの要素を取得
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // 初期状態では最初のタブを表示
    tabButtons[0].classList.add('active');
    tabContents[0].classList.add('active');

    // タブボタンにクリックイベントを追加
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // クリックされたタブのidを取得
            const tabId = this.getAttribute('data-tab');

            // すべてのタブボタンから active クラスを削除
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });

            // すべてのタブコンテンツから active クラスを削除
            tabContents.forEach(content => {
                content.classList.remove('active');
            });

            // クリックされたタブボタンに active クラスを追加
            this.classList.add('active');

            // 対応するタブコンテンツに active クラスを追加
            document.getElementById(`${tabId}-content`).classList.add('active');
        });
    });

    // URLハッシュに基づいてタブを初期化（ページロード時）
    function initTabFromHash() {
        // URLからハッシュを取得
        const hash = window.location.hash.substring(1);

        // ハッシュが存在し、そのIDを持つタブコンテンツが存在する場合
        if (hash && document.getElementById(`${hash}-content`)) {
            // 対応するタブボタンをクリック
            const tabButton = document.querySelector(`.tab-button[data-tab="${hash}"]`);
            if (tabButton) {
                tabButton.click();
                return;
            }
        }

        // ハッシュがない場合や一致するタブがない場合はデフォルトのタブ（最初のタブ）をアクティブにする
        if (tabButtons.length > 0) {
            tabButtons[0].click();
        }
    }

    // 初期化を実行
    initTabFromHash();

    // ブラウザの戻る・進むボタンでタブを切り替えられるようにする
    window.addEventListener('hashchange', initTabFromHash);
});
