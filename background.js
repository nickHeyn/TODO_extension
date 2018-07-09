chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({'list': []}, function() {
      console.log('Empty list added');
    });
    chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
  });