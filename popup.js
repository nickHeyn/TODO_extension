var list = document.getElementById('list');
var newListItem = document.getElementById('newListItem');
var notFinishedCount = 0;
var itemList = []; // array used to keep track of all the elements in the todo list

newListItem.focus();

// Get list items from storage
chrome.storage.sync.get('list', function(data) {
    var i;
    for(i = 0; i < data['list'].length; i++) {
        addElementToList(data['list'][i]);
    }
});

 // Add element to to-do list when the enter key is pressed
newListItem.addEventListener('keypress', function(e){
    if(e.keyCode == 13) { // keycode for the 'enter' key
        // add new item to list
        chrome.storage.sync.get('idCount', function(idNum){
            addElementToList({text:newListItem.value, checked: false, id : idNum.idCount});
            chrome.storage.sync.set({idCount:idNum.idCount+1});
            newListItem.value = '';
            saveList();
        });
    }
});

// takes in the data for the item and adds it to the list and item array
function addElementToList(item) {
    var li = document.createElement("li");
    li.id = item.id;
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.checked;
    // add checked listener. Will strikethough text if checked
    checkbox.addEventListener('change', function() {
        var label = this.nextElementSibling;
        if(this.checked) {
            label.style.textDecoration ="line-through";
            notFinishedCount--;
        }
        else {
            label.style.textDecoration ="none";
            notFinishedCount++;
        }
        var task = findTask(this.parentElement.id);
        task.checked = this.checked;
        saveList();
    });

    var label = document.createElement('label');
    if(item.checked) {
        label.style.textDecoration = "line-through";
    }
    else{
        notFinishedCount++;
    }
    label.appendChild(document.createTextNode(item.text));

    // adding the delete button
    var deleteButton = document.createElement('button');
    var deleteIcon = document.createElement('img');
    deleteIcon.className = "icon";
    deleteIcon.src ="images/delete-icon.png";
    deleteButton.appendChild(deleteIcon);
    deleteButton.className = "iconButton";
    deleteButton.addEventListener('click', function(){
        var id= parseInt(this.parentElement.id);
        if(!findTask(id).checked){
            notFinishedCount--;
        }
        this.parentElement.remove();
        removeTask(id);
        saveList();
    });

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(deleteButton);
    li.append
    list.appendChild(li);
    itemList.push(item);
}

// Saves the elements in the todo list to chrome.storage
function saveList() {
    chrome.storage.sync.set({'list': itemList}, function() {
        console.log('List updated');
    });
    if(notFinishedCount){
        chrome.browserAction.setBadgeText({text:String(notFinishedCount)});
    }
    else{
        chrome.browserAction.setBadgeText({text:''});
    }
}

function findTask(id) {
    for(var i = 0; i < itemList.length; i++){
        if(itemList[i].id == id){
            return itemList[i];
        }
    }
    return null;
}

function removeTask(taskID) {
    for(var i = 0; i < itemList.length; i++){
        if(itemList[i].id == taskID){
            itemList.splice(i, 1);
            break;
        }
    }
}

