const scoreValue = document.querySelectorAll(".score-value");
const addButton = document.querySelectorAll(".add");
const minusButton = document.querySelectorAll(".minus");
const replyButton = document.querySelectorAll(".reply");
const replyCard = document.querySelectorAll(".reply-card")[0];

// addButton.addEventListener("click", function () {
//     scoreValue.textContent = parseInt(scoreValue.textContent) + 1
// })

// minus.addEventListener("click", function () {
//     if (parseInt(scoreValue.textContent) > 0)
//         scoreValue.textContent = parseInt(scoreValue.textContent) - 1
// })

console.log(replyCard)
console.log(replyButton)
let pressedButton = [];

for (let i = 0; i < replyButton.length; i++) {
    replyButton[i].addEventListener("click", function () {
        if (!pressedButton.includes(i)) {
            const clonedReply = replyCard.cloneNode(true);
            clonedReply.style.display = "flex";
            this.parentElement.parentElement.parentElement.after(clonedReply);
            clonedReply.querySelector('.replyed-comment').innerHTML = "@" + this.getAttribute('name') + ", ";
            clonedReply.querySelector('.repliedAt').setAttribute("value", this.getAttribute('name'));
            clonedReply.querySelector('.commentId').setAttribute("value", this.getAttribute('id'));
            console.log(this.getAttribute('name'));
            pressedButton.push(i);
        }
    })
}
