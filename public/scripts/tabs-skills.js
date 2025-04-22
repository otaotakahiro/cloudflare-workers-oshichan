/**
 * 能力評価タブのデータを設定するモジュール
 */

/**
 * 能力評価タブのデータを設定
 * @param {Object} skills - 能力評価データ
 */
export function populateSkillsTab(skills) {
    if (!skills) return;

    // 特性別5段階評価
    populateSkillEvaluations(skills.evaluations);

    // 面接時の質問例
    populateInterviewQuestions(skills.interviewQuestions);

    // 危険サイン
    populateWarningSignals(skills.warningSignals);
}

/**
 * 特性別5段階評価の表示
 * @param {Array} evaluations - 評価項目の配列
 */
function populateSkillEvaluations(evaluations) {
    if (!evaluations || !evaluations.length) return;

    const evaluationsContainer = document.getElementById('skills-evaluations-container');
    if (!evaluationsContainer) {
        console.error('スキル評価コンテナが見つかりません');
        return;
    }

    evaluationsContainer.innerHTML = '';

    evaluations.forEach(evaluation => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'mb-8';

        // 評価項目と値
        const headerDiv = document.createElement('div');
        headerDiv.className = 'flex justify-between items-center mb-1';

        const title = document.createElement('h3');
        title.className = 'text-lg font-bold';
        title.textContent = evaluation.name;

        const score = document.createElement('span');
        score.className = 'font-bold text-lg';
        score.textContent = `${evaluation.score}/5`;

        headerDiv.appendChild(title);
        headerDiv.appendChild(score);
        itemDiv.appendChild(headerDiv);

        // スコアを確実に数値として扱う
        const scoreValue = parseInt(evaluation.score) || 0;
        // 5段階評価の場合、20%ずつ増加（1=20%, 2=40%, 3=60%, 4=80%, 5=100%）
        const percentage = Math.min(Math.max((scoreValue / 5) * 100, 0), 100);

        // プログレスバー - シンプルなDIV構造に変更
        const barHTML = `
        <div class="w-full bg-gray-200 rounded-full" style="height: 12px;">
            <div class="${getScoreColorClass(scoreValue)}"
                 style="width: ${percentage}%; height: 12px; border-radius: 9999px;"></div>
        </div>`;

        const barContainer = document.createElement('div');
        barContainer.className = 'mb-3';
        barContainer.innerHTML = barHTML;
        itemDiv.appendChild(barContainer);

        // 説明文
        const description = document.createElement('p');
        description.className = 'text-sm text-gray-700';
        description.textContent = evaluation.description;
        itemDiv.appendChild(description);

        evaluationsContainer.appendChild(itemDiv);
    });
}

/**
 * スコアに応じたカラークラスを取得
 * @param {number} score - 評価スコア（1-5）
 * @returns {string} CSSクラス
 */
function getScoreColorClass(score) {
    if (score >= 4) {
        return 'bg-green-500';
    } else if (score >= 3) {
        return 'bg-blue-500';
    } else if (score >= 2) {
        return 'bg-orange-500';
    } else {
        return 'bg-red-500';
    }
}

/**
 * 面接時の質問例の表示
 * @param {Array} questions - 質問の配列
 */
function populateInterviewQuestions(questions) {
    if (!questions || !questions.length) return;

    const questionsContainer = document.getElementById('interview-questions-container');
    if (!questionsContainer) {
        console.error('面接質問コンテナが見つかりません');
        return;
    }

    questionsContainer.innerHTML = '';

    questions.forEach(q => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'border rounded-lg p-4 bg-gray-50 mb-4';

        const question = document.createElement('p');
        question.className = 'font-bold mb-2';
        question.textContent = q.question;

        const purpose = document.createElement('p');
        purpose.className = 'text-sm text-gray-700';
        purpose.textContent = q.purpose;

        questionDiv.appendChild(question);
        questionDiv.appendChild(purpose);

        questionsContainer.appendChild(questionDiv);
    });
}

/**
 * 危険サインの表示
 * @param {Array} warnings - 警告の配列
 */
function populateWarningSignals(warnings) {
    if (!warnings || !warnings.length) return;

    const warningsContainer = document.getElementById('warning-signals-container');
    if (!warningsContainer) {
        console.error('警告サインコンテナが見つかりません');
        return;
    }

    warningsContainer.innerHTML = '';

    warnings.forEach(warning => {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'flex items-start gap-3 mb-2';

        const icon = document.createElement('div');
        icon.className = 'text-yellow-500 mt-1';
        icon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';

        const text = document.createElement('p');
        text.className = 'text-sm text-gray-700';
        text.textContent = warning;

        warningDiv.appendChild(icon);
        warningDiv.appendChild(text);

        warningsContainer.appendChild(warningDiv);
    });
}
