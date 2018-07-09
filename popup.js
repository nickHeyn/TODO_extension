var list = document.getElementById('list');
var newListItem = document.getElementById('newListItem');
newListItem.focus();
var itemList = []; // array used to keep track of all the elements in the todo list

// Get list items from storage
chrome.storage.sync.get('list', function(data) {
    var i;
    for(i = 0; i < data['list'].length; i++) {
        addElementToList(data['list'][i]);
    }
});

 // Add element to todo list when the enter key is pressed
newListItem.addEventListener('keypress', function(e){
    if(e.keyCode == 13) { // keycode for the 'enter' key
        // add new item to list
        addElementToList({text:newListItem.value, checked: false});      

        newListItem.value = '';

        saveList();
    }
});

// takes in the data for the item and adds it to the list and item array
function addElementToList(item) {
    var li = document.createElement("li");
    li.id = itemList.length;
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.checked;
    // add checked listener. Will strikethough text if checked
    checkbox.addEventListener('change', function() {
        var label = this.nextElementSibling;
        if(this.checked) {
            label.style.textDecoration ="line-through";
        }
        else {
            label.style.textDecoration ="none";
        }
        itemList[this.parentElement.id].checked = this.checked;
        saveList();
    });

    var label = document.createElement('label');
    if(item.checked) {
        label.style.textDecoration = "line-through";
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
        var idIndex = parseInt(this.parentElement.id);
        var htmlList = list.getElementsByTagName('li');
        for(var i = idIndex + 1; i < itemList.length; i++) {
            var idNum = parseInt(htmlList[i].id);
            htmlList[i].id = idNum-1;
        }
        this.parentElement.remove();
        itemList.splice(idIndex, 1);
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
}

