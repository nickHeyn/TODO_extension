chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({'list': []}, function() {
      console.log('Empty list added');
    });
  });