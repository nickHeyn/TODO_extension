var list = document.getElementById('list');
var addNewButton = document.getElementById('addNewButton');
var newListItem = document.getElementById('newListItem');
var cancelButton = document.getElementById('cancelNewItem')

// Get list items from storage
chrome.storage.sync.get('list', function(data) {
    var i;
    for(i = 0; i < data['list'].length; i++) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(data['list'][i]));
        list.appendChild(li);
    }
});

// shows neccessary elements when the plus button is pressed
addNewButton.onclick = function() {
    newListItem.style.display = 'inline-block';
    addNewButton.style.display = 'none';
    cancelButton.style.display = 'inline-block';
}  

 // Add element to todo list when the enter key is pressed
newListItem.addEventListener('keypress', function(e){
    if(e.keyCode == 13) { // keycode for the 'enter' key
        // add new item to list
        var new_li = document.createElement("li");
        new_li.appendChild(document.createTextNode(newListItem.value));
        list.appendChild(new_li);
        

        clearNewItemElements();
        saveItems();
    }
});

cancelButton.onclick = clearNewItemElements;

// close and clear input field and show the plus button again
function clearNewItemElements() {
    newListItem.value = '';
    newListItem.style.display = 'none';
    cancelButton.style.display = 'none';
    addNewButton.style.display = 'block';
}

// saves all the items in the todo list to chrome.storage
function saveItems() {
    var liItems = list.getElementsByTagName('li'); // array of the li elements
    var itemList = []; // array to be saved
    for(var i = 0; i < liItems.length; i++) {
        itemList.push(liItems[i].textContent);
    }

    chrome.storage.sync.set({'list': itemList}, function() {
        console.log('List updated');
    });
}
