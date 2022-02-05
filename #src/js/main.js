"use strict"

class Note {
    constructor(date) {
        this.noteString = "";
        this._noteName = "";
        this.fon = "#fff";
        this.fixedIndex = 0;
        this.date = date;
    }

    get noteName() {
        return this._noteName;
    }

    set noteName(value) {
        if (value.length < 1) {
            alert('Слишком короткое имя заметки!');
            return;
        }

        this._noteName = value;
    }


}


let notes = [],
    noteObj = {
        name: '',
        text: '',
    }

const indexAnim = {
    bind: 0,
    clear: 1,
}

let addNoteBtn = document.querySelector('.add-note-btn'),
    sidebar = document.querySelector('.sidebar'),
    noteMain = document.querySelector('.main-note'),
    noteMini = document.querySelector('.note-mini'),
    noteNameElem = document.querySelector('.form-note__name'),
    noteText = document.querySelector('.form-note__text'),
    iconCross = document.querySelector('#icon-cross');

noteMini.remove();



addNoteBtn.addEventListener('click', () => {
    console.log(notes);
    for (let value of notes) {
        if (value.noteName == '') {
            return;
        }
    }

    let noteMiniClone = noteMini.cloneNode(true);

    let date = new Date();
    let note = new Note(`${dateCorrection(date.getDate())}.${dateCorrection((date.getMonth() + 1))}`);
    note = new Proxy(note, {
        set(target, prop, value) {
            if (prop == 'noteName') {
                if (notes.find(note => note.noteName == value)) {
                    alert('такое имя уже есть!');
                    return false;
                }

                let noteStack = document.querySelectorAll('.note-mini');

                noteStack.forEach(note => {
                    if (note.children[0].textContent == target[prop]) {
                        note.children[0].textContent = value;
                    }
                });
            }


            target[prop] = value;
            return true;
        }
    })
    notes.push(note);

    noteMiniClone.children[0].textContent = note.noteName;
    noteMiniClone.children[1].textContent = note.date;

    sidebar.append(noteMiniClone);

    deleteListener();
    noteCallListener();
    binding.call(noteMiniClone);
});

noteNameElem.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        nameChange();
    }
});

noteText.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        textChange();
    }
});

iconCross.addEventListener('click', () => {
    comeInSight(indexAnim.clear);
    clearFocus();
});

function dateCorrection(date) {
    if (date < 10) {
        return `0${date}`;
    }

    return date;
}

function deleteListener() {
    let deleteNote = document.querySelectorAll('#icon-delete');

    deleteNote.forEach(note => {
        note.addEventListener('click', (e) => {
            e.stopPropagation();
            let nodeP = note.parentNode.parentNode;

            let index = notes.findIndex(elem => {

                if (nodeP.children[0].textContent.length == elem.noteName.length) {
                    if (nodeP.children[0].textContent == elem.noteName) {
                        return true;
                    }
                }
            });

            if (index == -1) {
                return;
            }

            clearNote(nodeP.children[0].textContent);
            notes.splice(index, 1);
            nodeP.remove();
        })
    })
}

function noteCallListener() {
    let noteStack = document.querySelectorAll('.note-mini');

    noteStack.forEach(noteMin => {
        noteMin.addEventListener('click', binding);
    })
}

function nameChange() {
    notes.find(note => note.noteName == noteObj.name).noteName = noteNameElem.value;
    noteObj.name = noteNameElem.value;
}

function textChange() {
    notes.find(note => note.noteName == noteObj.name).noteString = noteText.value;
    noteObj.text = noteText.value;
}

function clearNote(name) {
    if (name != noteNameElem.value) {
        return;
    }

    noteNameElem.value = '';
    noteText.value = '';

    comeInSight(indexAnim.clear);
}

function comeInSight(index) {
    switch (index) {
        case 0:
            noteMain.classList.remove('_come-in-sight');
            noteMain.classList.add('_come-in-sight');
            break;

        case 1:
            noteMain.classList.remove('_come-in-sight');
            break;
    }
}

function clearFocus() {
    let noteStack = document.querySelectorAll('.note-mini');

    noteStack.forEach(note => {
        if (note.classList.contains('_active-note-min')) {
            note.classList.remove('_active-note-min');
        }
    });
}

function binding() {
    clearFocus();
    this.classList.add('_active-note-min');

    let note = notes.find(note => note.noteName == this.children[0].textContent);

    noteObj.name = note.noteName;
    noteNameElem.value = note.noteName;

    noteObj.text = note.noteString;
    noteText.value = note.noteString;

    comeInSight(indexAnim.bind);
}