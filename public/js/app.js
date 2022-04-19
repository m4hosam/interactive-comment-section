const scoreValue = document.querySelectorAll(".score-value");
const addButton = document.querySelectorAll(".add");
const minusButton = document.querySelectorAll(".minus");
const replyButton = document.querySelectorAll(".reply");
const replyCard = document.querySelectorAll(".reply-card")[0];
const editCard = document.querySelectorAll(".edit-card")[0];
const deleteBtns = document.querySelectorAll(".delete");
const editBtns = document.querySelectorAll(".edit");
const blackBG = document.querySelector(".black-back");
const deleteCard = document.querySelector(".delete-card");
const cancelBtn = document.querySelector("#cancel");
const deleteBtn = document.querySelector("#delete-btn");



let pressedButton = [];

for (let i = 0; i < replyButton.length; i++) {
    replyButton[i].addEventListener("click", function () {
        if (!pressedButton.includes(i)) {
            const clonedReply = replyCard.cloneNode(true);
            clonedReply.style.display = "flex";
            this.parentElement.parentElement.parentElement.after(clonedReply);
            // console.log(this);
            clonedReply.querySelector('.replyed-comment').innerHTML = "@" + this.getAttribute('name') + ",";
            clonedReply.querySelector('.repliedAt').setAttribute("value", this.getAttribute('name'));
            clonedReply.querySelector('.commentId').setAttribute("value", this.getAttribute('id'));
            // console.log(this.getAttribute('name'));
            pressedButton.push(i);
        }
    })
}

for (const element of deleteBtns) {
    element.addEventListener("click", function () {
        deleteCard.style.display = "block";
        blackBG.style.display = "block";
        deleteBtn.setAttribute("value", this.getAttribute('value'));
        deleteBtn.setAttribute("name", this.getAttribute('name'));
    })
}

let pressedEditButtons = [];

for (let j = 0; j < editBtns.length; j++) {
    editBtns[j].addEventListener("click", function () {
        if (!pressedEditButtons.includes(j)) {
            const clonededit = editCard.cloneNode(true);
            const pElement = this.parentElement.nextElementSibling;
            var commentContent = pElement.textContent;
            clonededit.querySelector('.replyed-comment').textContent = commentContent.trim();
            clonededit.querySelector('button').setAttribute("value", this.getAttribute('value'));
            clonededit.querySelector('.idType').setAttribute("value", this.getAttribute('name'));
            clonededit.style.display = "flex";
            pElement.style.display = "none";
            pElement.after(clonededit);
            pressedEditButtons.push(j);
        }
    })
}

cancelBtn.addEventListener("click", function () {
    deleteCard.style.display = "none";
    blackBG.style.display = "none";
})
