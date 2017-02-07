'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function notes() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var action = arguments[1];

    if (typeof state === 'undefined') {
        return 0;
    }
    switch (action.type) {
        case "INIT":
            console.log(action);
            return action.firebase ? action.firebase : [];
        case 'POST':

            firebase.database().ref('/').set([].concat(_toConsumableArray(state), [{
                text: action.text,
                folder: action.folder,
                date: new Date().toLocaleDateString()
            }]));
            console.log(action);
            var model = {
                date: new Date().toLocaleDateString(),
                text: action.text,
                folder: action.folder
            };
            console.log(model);

            return [].concat(_toConsumableArray(state), [model]);
        case 'DELETE':
            return "";
        default:
            return state;
    }
}

var filter = function filter() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "SHOW_ALL";
    var action = arguments[1];

    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            // return state.filter((note) => {
            //     return note.type == action.search
            // });
            return action.folder;
        default:
            return state;
    }
};

var manageApp = function manageApp() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    return {
        notes: notes(state.notes, action),
        filter: filter(state.visibilityFilter, action)
    };
};

var store = Redux.createStore(manageApp);

var listInfoElement = document.getElementById('listInfo');
var listFolderElement = document.getElementById('listFolder');

function render() {

    var storeInfo = store.getState();
    listInfo.innerHTML = "";

    var notes = storeInfo.notes;

    if (storeInfo.filter != "SHOW_ALL") {
        notes = storeInfo.notes.filter(function (note) {
            return note.folder == storeInfo.filter;
        });
    }

    var listFolder = _.uniq(_.map(storeInfo.notes, 'folder'));

    listFolderElement.innerHTML = "";

    var li = document.createElement('li');
    li.className = "folder";
    li.innerHTML = "SHOW_ALL";
    li.addEventListener('click', function () {
        store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            folder: "SHOW_ALL"
        });
    });
    listFolderElement.appendChild(li);

    _.forEach(listFolder, function (folder) {
        var li = document.createElement('li');
        li.className = "folder";
        li.innerHTML = folder;
        li.addEventListener('click', function () {
            store.dispatch({
                type: 'SET_VISIBILITY_FILTER',
                folder: folder
            });
        });
        listFolderElement.appendChild(li);
    });

    _.forEach(notes, function (note) {
        var div = createItem(note);
        listInfoElement.appendChild(div);
    });
}

function createItem(data) {
    if (!data) {
        return;
    }
    var div = document.createElement('div');
    div.className = "item";

    var date = document.createElement('span');
    date.className = "date";
    date.innerHTML = data.date ? data.date : "";

    var folder = document.createElement('span');
    folder.className = "folder";
    folder.innerHTML = data.folder ? data.folder : "";

    var text = document.createElement('span');
    text.className = "text";
    text.innerHTML = data.text ? data.text : "";

    div.innerHTML = date.outerHTML + " [" + folder.outerHTML + "] - " + text.outerHTML;

    return div;
}

render();
store.subscribe(render);

// store.dispatch({
//     type: 'POST',
//     text: "hello world",
//     folder: 'global'
// });
//
// store.dispatch({
//     type: 'POST',
//     text: "second text",
//     folder: 'test'
// })


document.getElementById('theFormSubmit').addEventListener('click', function () {
    store.dispatch({
        type: 'POST',
        text: document.getElementById('theFormText').value,
        folder: document.getElementById('theFormFolder').value
    });
});

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAQwS8pmC5CQAXy6t5Aqr-mv2H91ie2xRY",
    authDomain: "note-ba19f.firebaseapp.com",
    databaseURL: "https://note-ba19f.firebaseio.com",
    storageBucket: "note-ba19f.appspot.com",
    messagingSenderId: "665862186754"
};
firebase.initializeApp(config);
var database = firebase.database();

database.ref('/').once('value').then(function (snapshot) {
    store.dispatch({
        type: 'INIT',
        firebase: snapshot.val()
    });
});

// database.ref('notes/').on('value', function(snapshot) {
//   console.log(snapshot.val());
//   store.dispatch({
//       type: 'INIT',
//       firebase: snapshot.val()
//   });
// });
