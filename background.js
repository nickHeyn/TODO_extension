chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({'list': []}, function() {
      console.log('Empty list added');
    });

    chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });

    // New task items get the current value of idCount which gets incremented everytime
    // a new task is created
    chrome.storage.sync.set({idCount: 0});

    var curDate = new Date();
    var nextDay = new Date();
    nextDay.setHours(0,0,0,0);
    nextDay.setDate(curDate.getDate()+1);

    // set alarm to remove finished tasks at midnight every day
    chrome.alarms.create("removeCompleted", 
    {
      when : nextDay.getTime(),
      periodInMinutes: 1440
    });

    chrome.alarms.onAlarm.addListener(function(alarms){
      removeCompletedTasks();
    });
  });


// removes all the finished tasks in the todo list (usually done every night at midnight by default)
function removeCompletedTasks() {
  var updatedList = [];
  chrome.storage.sync.get('list', function(data){
    for(var i = 0; i < data.list.length; i++) {
      if(data.list[i].checked == false){
        updatedList.push(data.list[i]);
      }
    }
    chrome.storage.sync.set({'list': updatedList}, function(){
      console.log("List updated");
    });
  });
}