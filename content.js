console.log("Content script loaded for Azure DevOps");

let extractedCode = '';

function extractCodeFromPage() {
  const codeContainer = document.querySelector('.monaco-scrollable-element');

  if (codeContainer) {
    const codeLines = codeContainer.querySelectorAll('.view-line');
    console.log("CODELINES", codeLines);

    codeLines.forEach((line) => {
      if (!extractedCode.includes(line.textContent)) { 
        extractedCode += line.textContent + '\n';
      }
    });
  } else {
    console.log("Code container not found. Trying alternative method.");

    const editorContent = document.querySelector('.editor-container');
    if (editorContent) {
      extractedCode = editorContent.textContent;
    }
  }

  console.log("EXTRACTED CODE", extractedCode);
  console.log("Extracted code length:", extractedCode.length);
  return extractedCode;
}

const observer = new MutationObserver(() => {
  extractCodeFromPage(); 
});

const codeContainer = document.querySelector('.monaco-scrollable-element');
if (codeContainer) {
  observer.observe(codeContainer, { childList: true, subtree: true });
}

function scrollToLoadMore() {
    const codeContainer = document.querySelector('.monaco-scrollable-element');
    if (codeContainer) {
        let scrollHeight = codeContainer.scrollHeight;
        let currentScroll = codeContainer.scrollTop;

        const scrollStep = 10;
        const scrollInterval = 20; 

        const scrollIntervalId = setInterval(() => {
            if (currentScroll + scrollStep < scrollHeight) {
                currentScroll += scrollStep;
                codeContainer.scrollTo(0, currentScroll);
            } else {
                clearInterval(scrollIntervalId); 
                extractCodeFromPage(); 
                
                observer.disconnect(); 
                console.log("Observer disconnected and scrolling stopped."); 
            }
        }, scrollInterval);

        setTimeout(() => {
            clearInterval(scrollIntervalId); 
            observer.disconnect();
            console.log("Observer disconnected after timeout.");
        }, 1000);
    }
}

scrollToLoadMore();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in content script:", request);
  
  if (request.action === 'extractCode') {
    const code = extractCodeFromPage();
    console.log("Sending response with code");
    console.log("Code preview:", code.substring(0, 100) + "..."); 
    sendResponse({ code: code });
  }
});
