const noteInput = document.getElementById("noteInput");
const addBtn = document.getElementById("addBtn");
const notesList = document.getElementById("notesList");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

function displayNotes() {

    notesList.innerHTML = "";

    notes.forEach((note, index) => {

        const li = document.createElement("li");

        li.textContent = note;

        const del = document.createElement("span");
        del.textContent = "X";
        del.classList.add("delete");

        del.addEventListener("click", function () {

            notes.splice(index, 1);

            saveNotes();

            displayNotes();

        });

        li.appendChild(del);

        notesList.appendChild(li);

    });

}

function saveNotes() {

    localStorage.setItem("notes", JSON.stringify(notes));

}

addBtn.addEventListener("click", function () {

    const newNote = noteInput.value.trim();

    if (newNote === "") return;

    notes.push(newNote);

    saveNotes();

    displayNotes();

    noteInput.value = "";

});

displayNotes();