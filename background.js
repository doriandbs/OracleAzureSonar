console.log("AEEEEEEEEEEEEEEEEEE")

chrome.action.onClicked.addListener((tab) => {
    console.log("TAAAB", tab)
  if (tab.url.includes('azure.com') || tab.url.includes('visualstudio.com')) {
    chrome.tabs.sendMessage(tab.id, { action: 'extractCode' }, (response) => {
      if (response && response.code) {
        console.log("HEYYYYYY")
        const results = lintCode(response.code);
        chrome.runtime.sendMessage({ action: 'lintResults', results: results });
      }
    });
  }
});

function lintCode(code) {
  const linter = new ESLint();
  const results = linter.lintText(code);
  return results;
}