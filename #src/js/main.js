"use strict"

class Note {
    constructor(date) {
        this.noteString = "";
        this._noteName = "";
        this.fon = "#fff";
        this.fixedIndex = 0;
        this.date = date;
        this._searchIndex = 0;
    }

    get noteName() {
        return this._noteName;
    }

    set noteName(value) {
        if (value.length < 1) {
            return;
        }

        this._noteName = value;
    }

    get index() {
        return this._searchIndex;
    }

    set index(value) {
        //if (!+value) {
        //    return;
        //}

        this._searchIndex = value;
    }
}

//индексы аниации для отображения и закрытия заметки
const indexAnim = {
    bind: 0,
    clear: 1,
}

let notes = [],
    range = new Range(),
    noteObj = {
        index: 0,
    }

let addNoteBtn = document.querySelector('.add-note-btn'),
    sidebar = document.querySelector('.sidebar'),
    noteMain = document.querySelector('.main-note'),
    noteMini = document.querySelector('.note-mini'),
    noteNameElem = document.querySelector('.form-note__name'),
    noteText = document.querySelector('.form-note__text'),
    actionsBtn = document.querySelector('.actions');

noteMini.remove();



addNoteBtn.addEventListener('click', () => {

    for (let value of notes) {
        if (value.noteName == '') {
            return;
        }
    }


    let date = new Date();
    let note = new Note(`${dateCorrection(date.getDate())}.${dateCorrection((date.getMonth() + 1))}`);
    note = new Proxy(note, {
        set(target, prop, value) {
            if (prop == 'noteName') {
                let noteStack = document.querySelectorAll('.note-mini');

                noteStack.forEach(note => {
                    if (note.children[2].textContent == target.index) {
                        note.children[0].textContent = value;
                    }
                });
            }


            target[prop] = value;
            return true;
        }
    })

    note.index = notes.length;
    noteObj.index = note.index;
    notes.push(note);


    let noteMiniClone = noteMini.cloneNode(true);
    noteMiniClone.children[0].textContent = note.noteName;
    noteMiniClone.children[1].textContent = note.date;
    noteMiniClone.children[2].textContent = note.index;

    sidebar.append(noteMiniClone);


    deleteListener(noteMiniClone);
    noteCallListener();
    binding.call(noteMiniClone);
});

noteNameElem.addEventListener('input', () => { nameChange() });

noteText.addEventListener('input', () => { textChange() });

//Приводить дату к форме 0_, если надо
function dateCorrection(date) {
    if (date < 10) {
        return `0${date}`;
    }

    return date;
}

function deleteListener(elem) {
    let btnDel = elem.children[3].children[0];

    btnDel.addEventListener('click', (e) => {
        e.stopPropagation();

        deleteNoteEverywhere(elem);
    })

}

function noteCallListener() {
    let noteStack = document.querySelectorAll('.note-mini');

    noteStack.forEach(noteMin => {
        noteMin.addEventListener('click', binding);
    })
}

function nameChange() {
    notes.find(note => note.index == noteObj.index).noteName = noteNameElem.value;
}

function textChange() {
    notes.find(note => note.index == noteObj.index).noteString = noteText.innerHTML;
}

//скрывает или подсвечивает заметку(запускает анимации) в зависимости от индекса
function comeInSight(index) {
    switch (index) {
        case 0:
            noteMain.classList.remove('_come-out-sight');
            noteMain.classList.add('_come-in-sight');
            break;

        case 1:
            noteMain.classList.remove('_come-in-sight');
            noteMain.classList.add('_come-out-sight');
            break;
    }
}

//убирает подсветку с заметок на которых имеется
function clearFocus() {
    let noteStack = document.querySelectorAll('.note-mini');

    noteStack.forEach(note => {
        if (note.classList.contains('_active-note-min')) {
            note.classList.remove('_active-note-min');
        }
    });
}

//устанавливает в главной панели заметок и объекте, хранящем текущие данные,
//информацию заметки, которую выбрал пользователь в sidebar
//так же активизирует подсветку заметки на которую кликнули в sidebar
function binding() {
    clearFocus();

    this.classList.add('_active-note-min');

    let note = notes.find(note => note.index == this.children[2].textContent);


    noteNameElem.value = note.noteName;
    noteText.innerHTML = note.noteString;

    noteObj.index = note.index;

    comeInSight(indexAnim.bind);
}

//полное удаление информации и отображения заметки
function deleteNoteEverywhere(nodeP) {
    let index = notes.findIndex(elem => {
        if (nodeP.children[2].textContent == elem.index) {
            return true;
        }
    });

    if (index == -1) {
        return;
    }

    clearNote(nodeP.children[2].textContent);
    notes.splice(index, 1);
    nodeP.remove();
    updateIndex();
}

//очищает главную панель заметки если в момент уделния заметка была открыта
function clearNote(index) {
    if (index != noteObj.index) {
        return;
    }

    noteNameElem.value = '';
    noteText.innerHTML = '';

    comeInSight(indexAnim.clear);
}

//обновляет везде индексы после удаления заметки
function updateIndex() {
    let noteStack = document.querySelectorAll('.note-mini');

    notes.forEach((elem, index) => {
        noteStack.forEach(noteMin => {
            if (noteMin.children[2].textContent == elem.index) {
                noteMin.children[2].textContent = index;
            }
        })

        if (elem.index == noteObj.index) {
            noteObj.index = index;
        }

        elem.index = index;
    })
}

actionsBtn.addEventListener('click', (e) => {
    let target = e.target;

    if (target.tagName == 'A') {
        target = target.children[0].id;
    } else if (target.tagName == 'IMG') {
        target = target.id;
    }

    switch (target) {
        case 'icon-b':
            deligate('bold');
            break;
        case 'icone-italics':
            deligate('italic');
            break;
        case 'icon-list':
            deligate('insertUnorderedList');
            break;
        case 'icon-paper':
            break;
        case 'icon-t-shirt':
            break;
        case 'icon-office':
            break;
        case 'icon-cross':
            comeInSight(indexAnim.clear);
            clearFocus();
            break;
    }
});

function deligate(tag) {
    document.execCommand(tag, false, null);
    noteText.focus();
    return false;
}

//Я начал полностью изменять логику редактирования текста, т.к. узнал что execCommand не везде поддерживается.
//Но не не было ещё сделано. Запушил так, вернув старый код в deligate из комментариев и закоментировав новый
//новый код делает тоже что и execCommand(но с ошибкой еще нерешенной)
//let selection = document.getSelection();
//    let firstIndexStr = selection.anchorOffset;
//    let lastIndexStr = selection.focusOffset;

//    let selected;
//    let firstStr;
//    let lastStr;

//    if (firstIndexStr < lastIndexStr) {
//        selected = noteText.textContent.slice(firstIndexStr, lastIndexStr);
//        firstStr = noteText.innerHTML.slice(0, firstIndexStr);
//        lastStr = noteText.innerHTML.slice(lastIndexStr, noteText.innerHTML.length);
//    } else {
//        selected = noteText.textContent.slice(lastIndexStr, firstIndexStr);
//        firstStr = noteText.innerHTML.slice(0, lastIndexStr);
//        lastStr = noteText.innerHTML.slice(firstIndexStr, noteText.innerHTML.length);
//    }

//    console.log(firstStr, selected, lastStr)


//    selected = `<${tag}>${selected}</${tag}>`;
//    noteText.innerHTML = firstStr + selected + lastStr;