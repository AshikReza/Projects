(function() {
    function scrapeProblemDetails() {
        const url = window.location.href;
        let problem = { title: '', body: '', source: '' };

        try {
            if (url.includes('leetcode.com/problems')) {
                problem.title = document.querySelector('div[data-cy="question-title"]')?.innerText || 'Title not found';
                problem.body = document.querySelector('div[data-track-load="description_content"]')?.innerText.substring(0, 4000) || 'Body not found';
                problem.source = 'LeetCode';
            } else if (url.includes('codeforces.com/problemset/problem')) {
                problem.title = document.querySelector('.problem-statement .title')?.innerText || 'Title not found';
                problem.body = document.querySelector('.problem-statement')?.innerText.substring(0, 4000) || 'Body not found';
                problem.source = 'Codeforces';
            } else if (url.includes('atcoder.jp/contests')) {
                problem.title = document.querySelector('h2')?.innerText || 'Title not found';
                problem.body = document.getElementById('task-statement')?.innerText.substring(0, 4000) || 'Body not found';
                problem.source = 'AtCoder';
            } else {
                 return null; // Not a supported page
            }
        } catch (e) {
            console.error("Gemini Extension: Could not parse problem details.", e);
            return null;
        }
        return problem;
    }

    const problemData = scrapeProblemDetails();
    if (problemData) {
        chrome.runtime.sendMessage({
            type: 'PROBLEM_SCRAPED',
            data: problemData
        });
    }
})();