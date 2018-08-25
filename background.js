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
    chrome.alarms.create("unfinishedNotification", 
    {
      when : nextDay.getTime()
    });

    chrome.alarms.onAlarm.addListener(function(alarm){
      switch(alarm.name){
        case "removeCompleted":
          removeCompletedTasks();
          break;
        case "unfinishedNotification":
          createNotification();
      }
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

function createNotification(){
  chrome.storage.sync.get("list", function(data){
    var unfinishedCount = 0;
    for(var i = 0; i < data.list.length; i++){
      if(data.list[i].checked == false){
        unfinishedCount++;
      }
    }
    if(unfinishedCount > 0){

      console.log("notification created");
      chrome.notifications.create("unfinishedTasks", 
      {
        title : "TO-DO List",
        type : "basic",
        iconUrl : "images/list_icon.png",
        message: "You have " + unfinishedCount + " incomplete task" + (unfinishedCount!=1 ? "s":"") + " in your TO-DO list!"
      });
    }
  });
}