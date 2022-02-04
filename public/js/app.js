const scoreValue = document.querySelector("#score-value");
const addButton = document.querySelector("#add");
const minusButton = document.querySelector("#minus");
const replyButton = document.querySelector(".reply");
const replyCard = document.querySelector(".reply-card");

addButton.addEventListener("click", function () {
    scoreValue.textContent = parseInt(scoreValue.textContent) + 1
})
minus.addEventListener("click", function () {
    if (parseInt(scoreValue.textContent) > 0)
        scoreValue.textContent = parseInt(scoreValue.textContent) - 1
})
replyButton.addEventListener("click", function () {
    const clonedReply = replyCard.cloneNode(true);
    clonedReply.style.display = "flex";
    this.parentElement.parentElement.parentElement.after(clonedReply);
})