// adapted from https://aristath.github.io/blog/static-site-comments-using-github-issues-api

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

var body = document.currentScript.parentElement;
var header = document.createElement('h2');
header.innerHTML = "Comments";
body.appendChild(header);

var desc = document.createElement('p');
desc.innerHTML = "<strong>Click <a href='" + commentSite + "' target='_blank'>here</a> to post your own comment, or click a comment to reply to it.</strong> <em>You will need to use your GitHub account to post. Please use text or HTML formatting; markdown will not work. Comments appear on this page instantly.</em>";
body.appendChild(desc);

var ghCommentsList = document.createElement('div');
body.appendChild(ghCommentsList);

// get comments
var request = new XMLHttpRequest();
request.open('GET', apiUrl, true);
request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
        var response = JSON.parse(this.response);
        for (var i = 0; i < response.length; i++) {
            ghCommentsList.appendChild(createCommentEl(response[i]));
        }
        if (0 === response.length) {
            var noComments = document.createElement('p');
            noComments.innerHTML = "<em>No comments found for this article.</em>";
            ghCommentsList.appendChild(noComments);
        }
    } else {
        console.error(this);
    }
};

function createCommentEl( response ) {
    //var userAvatar = document.createElement( 'img' );
    //userAvatar.classList.add( 'avatar' );
    //userAvatar.setAttribute( 'src', response.user.avatar_url );
    //userAvatar.setAttribute( 'style', 'width: 40px; float: left;' );

    var commentContents = document.createElement('div')
    commentContents.setAttribute('style', 'background-color: ' + bgColor + '; padding: 1em 1em 1em 1em;');
    commentContents.classList.add('comment-content');
    var user = document.createElement('a');
    user.setAttribute('href', response.html_url);
    if(titleColor) {
        user.setAttribute("style", "color: " + titleColor + ";");
    }
    user.innerHTML = response.user.login + ' (' + response.created_at.slice(0, response.created_at.search('T')) + ')';
    user.classList.add('user');
    commentContents.appendChild(user)
    commentContents.innerHTML = commentContents.innerHTML + "<br/>" + response.body + "<br/>";

    var comment = document.createElement('p');
    comment.setAttribute('data-created', response.created_at);
    comment.setAttribute('data-author-avatar', response.user.avatar_url);
    comment.setAttribute('data-user-url', response.user.url);

    comment.appendChild(commentContents);

    return comment;
}

request.send();
