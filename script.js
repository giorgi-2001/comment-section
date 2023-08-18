const commentContainer = document.querySelector('.comment-container');
const popup = document.querySelector('.popup');
const url = 'data.json';


/* displays comments as well as user interface */
window.addEventListener('load', () => {
    displayData();
});



displayData = async () => {

    const res = await fetch(url);
    const data = await res.json();
    console.log(data);

    const comments = data.comments;
    const currentUser = data.currentUser;
    

    comments.map(comment => {

        const commentElement = buildCommentElement(comment);
        commentContainer.appendChild(commentElement);
        const replyContainer = buildElement('div', 'reply-container', '');
        
        const replies = comment.replies;
        replies.map(reply => {

            if (reply.user.username === currentUser.username) {
                addComment(reply.content, replyContainer, reply.replyingTo);
            } else  {
                const replyElement = buildCommentElement(reply);
                replyElement.classList.add('comment-reply');
                replyContainer.appendChild(replyElement);
            }
        })

        commentContainer.insertBefore(replyContainer, commentElement.nextSibling)
    })

}


const buildElement =  (tagName, classList, text) => {
    const element = document.createElement(tagName);
    element.className = classList;
    element.innerText = text;
    return element;
}


const appendChildren = (parent, children) => {
    children.forEach (child => {
        parent.appendChild(child);
    })
}


const buildCommentElement = (comment) => {

    const commentElement = buildElement('div', 'comment commented', '');

    const counter = buildElement('div', 'counter', '');
    const plus = buildElement('span', 'plus', '+');
    const Counternumber = buildElement('span', 'number', comment.score);
    const minus = buildElement('span', 'minus', '−');
    appendChildren(counter, [plus, Counternumber, minus]);
    commentElement.appendChild(counter);

    const commentHeader = buildElement('div', 'comment-header', '');
    const avatar = buildElement('img', 'avatar', '');
    avatar.src = comment.user.image.png;
    const userName = buildElement('span', 'user-name', comment.user.username);
    const date = buildElement('span', 'date', comment.createdAt);
    appendChildren(commentHeader, [avatar, userName, date]);
    commentElement.appendChild(commentHeader);

    const buttonContainer = buildElement('span', 'comment-buttons', '');
    const replyButton = buildElement('span', 'reply-button button-hover', '')
    replyButton.innerHTML = '<svg width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="#5357B6"/></svg> reply';
    buttonContainer.appendChild(replyButton);
    commentElement.appendChild(buttonContainer);
 
    if (comment.replyingTo) {
        const replyContent = buildElement('p', 'content', '');
        const replyingTo = buildElement('span', 'replying-to', `@${comment.replyingTo} `);
        replyContent.appendChild(replyingTo);
        replyContent.append(comment.content);
        commentElement.appendChild(replyContent); 
    } else if (!comment.replyingTo) {
        const content = buildElement('p', 'content', '');
        content.append(comment.content);
        commentElement.appendChild(content);
    }
    
    return commentElement;
}

const myForm = document.forms[0];
const commentArea = document.getElementById('comment-area');

myForm.addEventListener('submit', e => {
    e.preventDefault();
    if(commentArea.value === '') return;
    addComment(commentArea.value, commentContainer);
    commentArea.value = '';
})

const addComment = async (content, parent, replyingTo) => {

    const res = await fetch(url);
    const data = await res.json();
    const currentUser = data.currentUser;
    
    const commentObject = {
        score: 0,
        user: {
            username: currentUser.username,
            image: {
                png: currentUser.image.png
            }
        },
        createdAt: '1 second ago',
        replyingTo: replyingTo,
        content: content
    };

    const newComment = buildCommentElement(commentObject);
    parent.appendChild(newComment);

    const buttonContainer = newComment.querySelector('.comment-buttons');
    const replyBtn = newComment.querySelector('.reply-button');
    replyBtn.remove();
    const deleteBtn = buildElement('div', 'delete-button button-hover', '');
    deleteBtn.innerHTML = `<svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="#ED6368"/></svg>
    delete`
    const editBtn = buildElement('div', 'edit-button button-hover', '');
    editBtn.innerHTML = `<svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="#5357B6"/></svg>
    edit`
    const header = newComment.querySelector('.comment-header');
    const date = newComment.querySelector('.date');
    const you = buildElement('span', 'you', 'you');
    header.insertBefore(you, date);

    appendChildren(buttonContainer, [deleteBtn, editBtn]);
}


const createForm = (value) => {
    const newForm = buildElement('form', 'user-commenting__form', '');
    const newTextArea = buildElement('textArea', '', '');
    newTextArea.value = value;
    newTextArea.removeAttribute('style');
    const newButton = buildElement('button', 'send button-hover', 'UPDATE');
    newButton.setAttribute('data-update', true);
    appendChildren(newForm, [newTextArea, newButton]);
    return newForm;
}

document.addEventListener('click', e => {
    const isThisDeleteBtn = e.target.classList.contains('delete-button');
    const comment = e.target.closest('.comment');
    
    if (isThisDeleteBtn) {
        comment.setAttribute('data-delete', true);
        popup.setAttribute('data-open', true);
    }

    const isThisCancel = e.target.classList.contains('cancel');
    const isThisFinalDelete = e.target.classList.contains('final-delete');

    if (isThisCancel) {
        document.querySelector('[data-delete="true"]').setAttribute('data-delete', false);
        popup.setAttribute('data-open', false);
    }

    if (isThisFinalDelete) {
        popup.setAttribute('data-open', false);
        document.querySelector('[data-delete="true"]').remove();
    }

    const isThiseditBtn = e.target.classList.contains('edit-button');
    if (isThiseditBtn) {
            if (comment.getAttribute('data-edit') === 'true') return;
            comment.setAttribute('data-edit', true);
            const content = comment.querySelector('.content');
            const newForm = createForm(content.innerText);
            newForm.setAttribute('data-edit', true);
            comment.appendChild(newForm);
            content.style.display = 'none';
            return;
    }

    const isThisUpdateBtn = e.target.getAttribute('data-update');
    if (isThisUpdateBtn) {
        e.preventDefault();
        const content = comment.querySelector('.content');
        const currentForm = comment.querySelector('[data-edit="true"]');
        const currentTextArea = currentForm.querySelector('textarea')
        
        if (currentTextArea.value === '') return;

        content.style.display = 'block';
        content.innerText = currentTextArea.value;
        comment.setAttribute('data-edit', false);
        currentForm.remove();
        return;
    }

    const isThisReplyButton = e.target.classList.contains('reply-button');
    if (isThisReplyButton) {

        const openedComenters = [...document.querySelectorAll('.user-commenting')].slice(0, -1);

        if (openedComenters.length > 0) {
            openedComenters.forEach (openedComenter => {
                openedComenter.remove();
            })
        };

        const userName = comment.querySelector('.user-name');
        userName.setAttribute('data-replying-to', true);
        const newCommentingElement = buildElement('div', 'comment user-commenting', '');
        const img = buildElement('img', '', '');
        fetch(url).
        then(res => {
            data = res.json();
            return data;
        }).
        then(data => {
            img.src = data.currentUser.image.png;
        })
        const newForm = createForm('');
        appendChildren(newCommentingElement, [img, newForm]);
        const sendReplyBtn = newCommentingElement.querySelector('.send');
        sendReplyBtn.removeAttribute('data-update');
        sendReplyBtn.textContent = 'REPLY';
        sendReplyBtn.setAttribute('data-reply', true);

        if (!comment.nextSibling) {
            comment.parentElement.appendChild(newCommentingElement);
            return;
        };
        if (comment.nextSibling.classList.contains('reply-container')) {
            const firsComment = comment.nextSibling.querySelector('.comment-reply');
            comment.nextSibling.insertBefore(newCommentingElement, firsComment);
        } else if (comment.classList.contains('comment-reply')){
            comment.parentElement.insertBefore(newCommentingElement, comment.nextSibling);
        } 
        return;
    }

    const isThisSendReplyBtn = e.target.getAttribute('data-reply') === 'true';
    if(isThisSendReplyBtn) {
        e.preventDefault();
        const currentReplyContainer = comment.closest('.reply-container');
        const replyingTo = document.querySelector('[data-replying-to="true"]');
        const currentCommentArea = comment.querySelector('textarea');

        if (currentCommentArea.value === '') return;

        addComment(currentCommentArea.value, currentReplyContainer, replyingTo.textContent);
        replyingTo.removeAttribute('data-replying-to');
        comment.remove();
        return;
    }

    
    const isThisPlus = e.target.classList.contains('plus');
    const isThisMinus = e.target.classList.contains('minus');
    if (isThisPlus) {
        const counter = comment.querySelector('.counter');
        const counterNumber = counter.querySelector('.number');
        if (counter.getAttribute('data-voted') === 'true') return;
        let realNumber = parseInt(counterNumber.textContent);
        realNumber++
        counterNumber.textContent = realNumber;
        counter.setAttribute('data-voted', true);
        return;
    }  
    if (isThisMinus) {
        const counter = comment.querySelector('.counter');
        const counterNumber = counter.querySelector('.number');
        if (counter.getAttribute('data-voted') !== 'true') return;
        let realNumber = parseInt(counterNumber.textContent);
        realNumber--;
        counterNumber.textContent = realNumber;
        counter.setAttribute('data-voted', false);
        return;
    }
    

    const isThisUserCommenting = e.target.closest('.user-commenting');
    if (isThisUserCommenting) return;
    const openedComenters = [...document.querySelectorAll('.user-commenting')].slice(0, -1);
    const allReplyingTos = document.querySelectorAll('[data-replying-to="true"]');
    openedComenters.forEach (openedComenter => {
        openedComenter.remove();
    })
    allReplyingTos.forEach (replyingTo => {
        replyingTo.removeAttribute('data-replying-to');
    })
})


