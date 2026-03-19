const inputText = document.getElementById("inputText");
const addBtn = document.getElementById("add-btn");
const listContainer = document.querySelector(".list-container");
const list = document.querySelector(".list");

let editItem = null

addBtn.addEventListener("click", function () {
    const inputValue = inputText.value;

    //. edit item
    if (editItem) {
        editItem.firstChild.nodeValue = inputValue;
        editItem = null;
        addBtn.textContent = "Add";
        inputText.value = "";
        return;
    }

    //. delete 
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
        li.remove();
    });

    //. eidt 
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.style.backgroundColor = "#f702c2";

    editBtn.addEventListener("click", function () {
        ;

        const text = li.firstChild.textContent;
        inputText.value = text;
        inputText.focus();
        editItem = li;
        addBtn.textContent = "Update";
    });


    const div = document.createElement("div");
    div.appendChild(editBtn)
    div.appendChild(deleteBtn)
    div.id = "div";

    const li = document.createElement("li");
    li.textContent = inputValue;
    li.appendChild(div);
    list.appendChild(li);
    inputText.value = "";
});