chrome.tabs.onUpdated.addListener(function(tabId, change, tab) {
  if (change.status == "complete") {
    chrome.tabs.sendRequest(tabId, {});
  }
});

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendRequest(tabs[0].id, {});
});
