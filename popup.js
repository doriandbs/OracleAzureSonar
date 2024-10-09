document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'lintResults') {
        displayResults(request.results);
      }
    });
  });
  
  function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
  
    if (results.length === 0) {
      resultsDiv.textContent = 'Aucune erreur ESLint détectée.';
    } else {
      const ul = document.createElement('ul');
      results.forEach((result) => {
        const li = document.createElement('li');
        li.textContent = `Ligne ${result.line}: ${result.message} (${result.ruleId})`;
        ul.appendChild(li);
      });
      resultsDiv.appendChild(ul);
    }
  }