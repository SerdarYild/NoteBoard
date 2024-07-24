let titles = [];
let notes = [];
let deleteTitles = [];
let deleteNotes = [];

load();
loadDeleted();

function render() {
    let input = document.getElementById("inputContainer");
    let content = document.getElementById("content");
    input.innerHTML = "";
    input.innerHTML += `
    <div class="inputContainer">
        <input id="title" class="input-titel" placeholder="Title" type="text" required>
        <textarea id="note" class="input-note" placeholder="Note" type="text" required></textarea>
    <div class="button-area">
        <a onclick="addNote()"><img class="button" src="./img/savenote.png"/></a>
    </div>
    </div>
    `;
    content.innerHTML = "";
    for (let i = 0; i < titles.length; i++) {
        const title = titles[i];
        const note = notes[i].replace(/\n/g, "<br>");

        content.innerHTML += `
        <div id="noteArea${i}" class="note-area">
            <div class="note-content">
                <h3 class="title">${title}</h3>
                <p class="note">${note}</p>
            </div> 
            <div class="icon-note">
                <a id="editButton" class="edit" onclick="editNote(${i})"><img src="./img/edit.png"></a>
                <img class="delete-btn" onclick="deleteNote(${i})" src="./img/deletenote.png">
            </div>
        </div>
        `;
    }
    
    save();
}


function addNote() {
    let title = document.getElementById("title");
    let note = document.getElementById("note");

    if (title.value == "" || note.value == "") {
        alert("Beide Felder ausfüllen!");
    } else {
        titles.push(title.value);
        notes.push(note.value);
    }

    render();
    save();
}


function deleteNote(i) {
    deleteTitles.push(titles[i]);
    deleteNotes.push(notes[i]);

    titles.splice(i, 1);
    notes.splice(i, 1);

    saveDeleted();
    render();
}


function save() {
    let titlesAsText = JSON.stringify(titles);
    let notesAsText = JSON.stringify(notes);

    localStorage.setItem("titles", titlesAsText);
    localStorage.setItem("notes", notesAsText);
}


function load() {
    let titlesAsText = localStorage.getItem("titles");
    let notesAsText = localStorage.getItem("notes");

    if (titlesAsText && notesAsText) {
        titles = JSON.parse(titlesAsText);
        notes = JSON.parse(notesAsText);
    }
}


function editNote(i) {
    let noteToEdit = document.getElementById(`noteArea${i}`);
    noteToEdit.innerHTML = "";

    noteToEdit.innerHTML = `
    <div id="noteArea${i}" class="note-area">
        <div class="note-content">
            <textarea id="editedTitle${i}" class="editNote">${titles[i]}</textarea>
        </div>
            <textarea id="editedNote${i}" class="editNote">${notes[i]}</textarea>
        <div class="icon-note">
            <a id="editButton" class="edit" onclick="saveEdit(${i})"><img src="./img/savenote.png"></a>
        </div>
    </div>
    `;
}


function saveEdit(i) {
    let content = document.getElementById(`noteArea${i}`);
    let title = document.getElementById(`editedTitle${i}`).value;
    let note = document.getElementById(`editedNote${i}`).value;

    content.innerHTML = "";

    let editTitles = [...titles.slice(0, i), title, ...titles.slice(i + 1)];
    let editNotes = [...notes.slice(0, i), note, ...notes.slice(i + 1)];

    titles = editTitles;
    notes = editNotes;

    render();
}


function renderDeleted() {
    let input = document.getElementById("inputContainer");
    let content = document.getElementById('content');
    
    input.innerHTML = "";
    content.innerHTML = "";

    for (let i = 0; i < deleteTitles.length; i++) {
        const deleteTitle = deleteTitles[i];
        const deleteNote = deleteNotes[i].replace(/\n/g, "<br>");

        content.innerHTML += `
        <div class="note-area">
        <div class="note-content">
            <h3 class="title">${deleteTitle}</h3>
            <p class="note">${deleteNote}</p>
                <div class="delete-container">
                    <a class="delete-permanently" onclick="deletePermanently(${i})"><img class="delete-btn" src="./img/delete.png"></a>
                    <img class="delete-btn" onclick="recelynDeleted(${i})" src="./img/recyceln.png">
                </div>
            </div>           
        </div>
        `;
    }
    loadDeleted();
}


function saveDeleted() {
    localStorage.setItem('titlesDelete', JSON.stringify(deleteTitles));
    localStorage.setItem('notesDelete', JSON.stringify(deleteNotes));
}


function loadDeleted() {
    let titlesDeleteAsText = localStorage.getItem("titlesDelete");
    let notesDeleteAsText = localStorage.getItem("notesDelete");

    if (titlesDeleteAsText && notesDeleteAsText) {
        deleteTitles = JSON.parse(titlesDeleteAsText);
        deleteNotes = JSON.parse(notesDeleteAsText);
    }
}


function recelynDeleted(i) {
    titles.push(deleteTitles[i]);
    notes.push(deleteNotes[i]);

    deleteTitles.splice(i, 1);
    deleteNotes.splice(i, 1);

    saveDeleted();
    save();
    renderDeleted();
}


function deletePermanently(i) {
    deleteTitles.splice(i, 1);
    deleteNotes.splice(i, 1);

    saveDeleted();
    renderDeleted();
}