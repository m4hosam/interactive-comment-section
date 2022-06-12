const scoreValue = document.querySelectorAll(".score-value");
const addButton = document.querySelectorAll(".add");
const minusButton = document.querySelectorAll(".minus");
const replyButton = document.querySelectorAll(".reply");
const editCard = document.querySelectorAll(".edit-card")[0];
const deleteBtns = document.querySelectorAll(".delete");
const editBtns = document.querySelectorAll(".edit");
const blackBG = document.querySelector(".black-back");
const deleteCard = document.querySelector(".delete-card");
const cancelBtn = document.querySelector("#cancel");
const deleteBtn = document.querySelector("#delete-btn");
const scoreDiv = document.querySelectorAll(".score");
const replyCard = document.querySelectorAll(".reply-card")[0];



let pressedButton = [];

for (let i = 0; i < replyButton.length; i++) {
    replyButton[i].addEventListener("click", function () {
        if (!pressedButton.includes(i)) {
            const clonedReply = replyCard.cloneNode(true);
            clonedReply.style.display = "flex";
            const classWeb = this.parentElement.parentElement.parentElement;
            const classPhone = this.parentElement.parentElement;
            if (classWeb.className == "basic-card")
                classWeb.after(clonedReply)
            else if (classPhone.className == "basic-card")
                classPhone.after(clonedReply)

            clonedReply.querySelector('.replyed-comment').innerHTML = "@" + this.getAttribute('name') + ",";
            clonedReply.querySelector('.repliedAt').setAttribute("value", this.getAttribute('name'));
            clonedReply.querySelector('.commentId').setAttribute("value", this.getAttribute('id'));
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
            const pElementReply = this.parentElement.parentElement.querySelector(".reply-content");
            const pElementComment = this.parentElement.parentElement.querySelector(".comment-content");
            if (pElementReply == null) {
                var pElement = pElementComment;
                // console.log(pElement)
            }
            else
                var pElement = pElementReply;
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


const mediaQuery = window.matchMedia('(max-width: 660px)')


function handleTabletChange(e) {
    // Check if the media query is true
    if (e.matches) {
        // 'Media Query Matched!
        const replyCards = document.querySelectorAll(".reply-card");

        // move Reply Edit Delete button to the score Div
        for (const element of scoreDiv) {
            let deleteBtnPhone = element.nextElementSibling.querySelector(".delete");
            let editBtnPhone = element.nextElementSibling.querySelector(".edit");
            let replyBtnPhone = element.nextElementSibling.querySelector(".reply");
            if (deleteBtnPhone != null && editBtnPhone != null) {
                element.appendChild(deleteBtnPhone);
                element.appendChild(editBtnPhone);

            }
            else if (replyBtnPhone != null) {
                element.appendChild(replyBtnPhone);
            }
        }
        // redesign the cards for phone version in the replycards
        for (const card of replyCards) {
            const node = document.createElement("div");
            const replyButtona = card.querySelector("button");
            const logoImga = card.querySelector("img");
            const replyCard = card.querySelector("form");
            node.appendChild(logoImga);
            node.appendChild(replyButtona);
            replyCard.appendChild(node);

        }
    }
    else {
        // returned to initials
        const replyCards = document.querySelectorAll(".reply-card");
        // Back Reply Edit Delete button to initials
        for (const element of scoreDiv) {
            let deleteBtnPhone = element.querySelector(".delete");
            let editBtnPhone = element.querySelector(".edit");
            let replyBtnPhone = element.querySelector(".reply");
            let cardHeader = element.nextElementSibling.querySelector(".card-header");
            if (deleteBtnPhone != null && editBtnPhone != null) {
                cardHeader.appendChild(deleteBtnPhone);
                cardHeader.appendChild(editBtnPhone);
            }
            else if (replyBtnPhone != null) {
                cardHeader.appendChild(replyBtnPhone);
            }
        }

        // back the cards for web version in the replycards
        for (const card of replyCards) {
            const node = card.querySelector("div");
            const replyButtonz = card.querySelector("button");
            const logoImgz = card.querySelector("img");
            const cardNeeded = card.querySelector("form");
            cardNeeded.prepend(logoImgz);
            cardNeeded.appendChild(replyButtonz);
            if (node != null)
                node.remove();
        }
    }
}

mediaQuery.addListener(handleTabletChange)
handleTabletChange(mediaQuery)
