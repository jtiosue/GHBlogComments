// adapted from https://aristath.github.io/blog/static-site-comments-using-github-issues-api

// markdown to html
// https://www.bigomega.dev/markdown-parser
function parseMarkdown(markdownText) {
    const htmlText = markdownText
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
        .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
        .replace(/\*(.*)\*/gim, '<i>$1</i>')
        .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
        .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
        .replace(/\n$/gim, '<br />')

    return htmlText.trim()
}


// get attributes
const repoName = document.currentScript.getAttribute("data-repoName");
const issueNumber = document.currentScript.getAttribute("data-issueNumber");
const apiUrl = 'https://api.github.com/repos/' + repoName + '/issues/' + issueNumber + '/comments';
const commentSite = "https://github.com/" + repoName + "/issues/" + issueNumber;

var bgColor = '#edf9fc';
if(document.currentScript.getAttribute("data-bgColor")) {
    bgColor = document.currentScript.getAttribute("data-bgColor");
}

var titleColor = false;
if(document.currentScript.getAttribute("data-titleColor")) {
    titleColor = document.currentScript.getAttribute("data-titleColor");
}

console.log('repoName: ' + repoName + '; issueNumber: ' + issueNumber + '; bgColor: ' + bgColor + '; titleColor: ' + titleColor + ';');

let body = document.currentScript.parentElement;
let header = document.createElement('h2');
header.innerHTML = "Comments";
body.appendChild(header);

let desc = document.createElement('p');
desc.innerHTML = "<strong>Click <a href='" + commentSite + "' target='_blank'>here</a> to post your own comment, or click a comment to reply to it.</strong> <em>You will need to use your GitHub account to post. Please use text or HTML formatting; markdown will not work. Comments appear on this page instantly.</em>";
body.appendChild(desc);

let ghCommentsList = document.createElement('div');
body.appendChild(ghCommentsList);

// get comments
let request = new XMLHttpRequest();
request.open('GET', apiUrl, true);
request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
        let response = JSON.parse(this.response);
        for (let i = 0; i < response.length; i++) {
            ghCommentsList.appendChild(createCommentEl(response[i]));
        }
        if (0 === response.length) {
            let noComments = document.createElement('p');
            noComments.innerHTML = "<em>No comments found for this article.</em>";
            ghCommentsList.appendChild(noComments);
        }
    } else {
        console.error(this);
    }
};

function createCommentEl( response ) {
    //let userAvatar = document.createElement( 'img' );
    //userAvatar.classList.add( 'avatar' );
    //userAvatar.setAttribute( 'src', response.user.avatar_url );
    //userAvatar.setAttribute( 'style', 'width: 40px; float: left;' );

    let commentContents = document.createElement('div')
    commentContents.setAttribute('style', 'background-color: ' + bgColor + '; padding: 1em 1em 1em 1em;');
    // commentContents.classList.add('comment-content');
    let user = document.createElement('a');
    user.setAttribute('href', response.html_url);
    if(titleColor) {
        user.setAttribute("style", "color: " + titleColor + ";");
    }
    user.innerHTML = response.user.login + ' (' + response.created_at.slice(0, response.created_at.search('T')) + ')';
    user.classList.add('user');
    commentContents.appendChild(user)
    commentContents.innerHTML = commentContents.innerHTML + "<br/>" + parseMarkdown(response.body) + "<br/>";

    let comment = document.createElement('p');
    comment.setAttribute('data-created', response.created_at);
    comment.setAttribute('data-author-avatar', response.user.avatar_url);
    comment.setAttribute('data-user-url', response.user.url);

    comment.appendChild(commentContents);

    return comment;
}

request.send();
