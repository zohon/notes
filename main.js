function notes(state = [], action) {
    if (typeof state === 'undefined') {
        return 0
    }
    switch (action.type) {
        case "INIT" :
        console.log(action);
            return action.firebase
        case 'POST':

           firebase.database().ref('notes').set([...state,{
              text: action.text,
              folder: action.folder,
              date: new Date().toLocaleDateString()
            }]);

            return [
                ...state, {
                    date: new Date().toLocaleDateString(),
                    text: action.text,
                    folder: action.folder
                }
            ];
        case 'DELETE':
            return ""
        default:
            return state
    }
}

const filter = (state = "SHOW_ALL", action) => {
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

const manageApp = (state = {}, action) => {
    return {
        notes: notes(state.notes, action),
        filter: filter(state.visibilityFilter, action)
    };
}

var store = Redux.createStore(manageApp);

var listInfoElement = document.getElementById('listInfo');
var listFolderElement = document.getElementById('listFolder');

function render() {

    var storeInfo = store.getState();
    listInfo.innerHTML = "";

    var notes = storeInfo.notes;

    if (storeInfo.filter != "SHOW_ALL") {
        notes = storeInfo.notes.filter((note) => {
            return note.folder == storeInfo.filter
        });
    }

    var listFolder =  _.uniq(_.map(storeInfo.notes, 'folder'));

    listFolderElement.innerHTML = "";

    var li = document.createElement('li');
    li.className = "folder";
    li.innerHTML = "SHOW_ALL";
    li.addEventListener('click', function() {
        store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            folder: "SHOW_ALL"
        });
    });
    listFolderElement.appendChild(li);

    _.forEach(listFolder, function(folder) {
        var li = document.createElement('li');
        li.className = "folder";
        li.innerHTML = folder;
        li.addEventListener('click', function() {
            store.dispatch({
                type: 'SET_VISIBILITY_FILTER',
                folder: folder
            });
        });
        listFolderElement.appendChild(li);
    });

    _.forEach(notes, function(note) {
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
    date.innerHTML = (data.date ? data.date : "");

    var folder = document.createElement('span');
    folder.className = "folder";
    folder.innerHTML = (data.folder ? data.folder : "");

    var text = document.createElement('span');
    text.className = "text";
    text.innerHTML = (data.text ? data.text : "");

    div.innerHTML = date.outerHTML + " [" + folder.outerHTML + "] - " + text.outerHTML;

    return div;
}

render()
store.subscribe(render)

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


document.getElementById('theFormSubmit').addEventListener('click', function() {
    store.dispatch({
        type: 'POST',
        text: document.getElementById('theFormText').value,
        folder: document.getElementById('theFormFolder').value
    })
})


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

database.ref('/notes/').once('value').then(function(snapshot) {
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

function addTofirebase() {
  // firebase.database().ref('notes').set([...notes,{
  //     text: "add",
  //     folder: "firebases"
  //   }]);
}
