chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({'list': []}, function() {
      console.log('Empty list added');
    });
    chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });

    // New task items get the current value of idCount which gets incremented everytime
    // a new task is created
    chrome.storage.sync.set({idCount: 0});
  });