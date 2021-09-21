export async function  renderFeed() {
    let result = await axios({
        method: 'get',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
      });
    let feed = document.getElementById("newsfeed");
    for(let i = 0; i < result.data.length; i++){
        let container = document.createElement("div");
        container.className = "col-md-6 tweet-card";
        let card = document.createElement("div");
        card.className = "card";
        let cardBody = document.createElement("div");
        cardBody.className = "card-body";
        //cardBody.setAttribute('data-id',result.data[i].id);
        cardBody.id = result.data[i].id;
        let cardText = document.createElement("p");
        cardText.className = "card-text twt-bdy";
        cardText.innerHTML = result.data[i].body;
        let author = document.createElement("h6");
        author.className = "card-subtitle mb-2 text-muted";
        author.innerHTML = result.data[i].author;
        let likeDis = document.createElement("p");
        likeDis.className = "card-link";
        likeDis.setAttribute('data-liked', 0)
        likeDis.innerHTML = result.data[i].likeCount + " likes";
        let rtDis = document.createElement("p");
        rtDis.className = "card-link";
        rtDis.innerHTML = result.data[i].retweetCount + " retweets";
        let replyBtn = document.createElement("p");
        replyBtn.className = "card-link";
        replyBtn.innerHTML = result.data[i].replyCount + " replies";
        let editBtn = document.createElement("button");
        editBtn.className = "card-link editBtn";
        editBtn.innerHTML = "edit";
        let deleteBtn = document.createElement("button");
        deleteBtn.className = "card-link delTwtBtn";
        deleteBtn.innerHTML = "delete";
        let likeBtn = document.createElement("button");
        likeBtn.className = "card-link likeBtn"
        if(result.data[i].isLiked){
            likeBtn.innerHTML = "unlike";
        } else {
            likeBtn.innerHTML = "like";
        }
        likeBtn.setAttribute('data-isLiked', result.data[i].isLiked);
        let rtBtn = document.createElement("button");
        rtBtn.className = "card-link rtBtn";
        rtBtn.innerHTML = "retweet";
        let editDiv = document.createElement("div");
        editDiv.className = "editDiv";
        let editDivT = document.createElement("div");
        editDivT.className = "editDiv";
        let replyBut = document.createElement("button");
        replyBut.className = "card-link replyBut";
        replyBut.innerHTML = "reply";
        let editDivS = document.createElement("div");
        editDivS.className = "editDiv";
        cardBody.appendChild(cardText);
        cardBody.appendChild(author);
        cardBody.appendChild(likeDis);
        cardBody.appendChild(rtDis);
        cardBody.appendChild(replyBtn);
        if(result.data[i].isMine) {
            cardBody.appendChild(deleteBtn);
            cardBody.appendChild(editBtn);
            cardBody.appendChild(editDiv);
        }
        cardBody.appendChild(likeBtn);
        cardBody.appendChild(rtBtn);
        cardBody.appendChild(editDivT);
        cardBody.appendChild(replyBut);
        cardBody.appendChild(editDivS);
        card.appendChild(cardBody);
        container.appendChild(card);
        feed.appendChild(container);
    }

    $('.editBtn').on('click', handleEditBtn);
    $('.delTwtBtn').on('click', handleDeleteBtn);
    $('.likeBtn').on('click', handleLikeTwt);
    $('.rtBtn').on('click', handleRtBtn);
    $('.replyBut').on('click', handleReply);
}
export async function handleLikeTwt(event) {
    let url = 'https://comp426-1fa20.cs.unc.edu/a09/tweets/';
    let id = $(event.target).closest('.card-body').attr('id');
    url = url + id;
    if($(event.target).attr('data-isLiked') == "false") {
        $(event.target).attr('data-isLiked', "true");
        $(event.target).html("unlike");
        url += "/like";
        const result = await axios({
            method: 'put',
            url,
            withCredentials: true,
        });
    } else {
        $(event.target).attr('data-isLiked', "false");
        $(event.target).html("like");
        url += "/unlike";
        const result = await axios({
            method: 'put',
            url,
            withCredentials: true,
        });
    }
}
export async function handleDeleteBtn(event) {
    let url = 'https://comp426-1fa20.cs.unc.edu/a09/tweets/';
    let id = $(event.target).closest('.card-body').attr('id');
    url = url + id;
    const result = await axios({
        method: 'delete',
        url,
        withCredentials: true,
      });
}
export const handleEditBtn = function(event) {
    //let body = $(event.target).closest('.card-text').text();
    $(event.target).next().replaceWith(renderEditTwt);
    $('#sendEditTwt').on('click', handleSendEditTwt);
    //debugger;
    $('#cancelEditTwt').on('click', handleCancelEditTwt);
}
export async function handleSendEditTwt(event) {
    let url = 'https://comp426-1fa20.cs.unc.edu/a09/tweets/';
    let id = $(event.target).closest('.card-body').attr('id');
    url = url + id;
    const result = await axios({
        method: 'put',
        url,
        withCredentials: true,
        data: {
          body: $('#editTwtBody').val(),
        },
      });
    $('#editTweetPls').replaceWith(unrenderEdit);
}
export const handleReply = function(event) {
    $(event.target).next().replaceWith(renderEditTwt);
    $('#sendEditTwt').on('click', handleSendReply);
    //debugger;
    $('#cancelEditTwt').on('click', handleCancelEditTwt);
}
export const handleRtBtn = function(event) {
    $(event.target).next().replaceWith(renderEditTwt);
    $('#sendEditTwt').on('click', handleSendRt);
    //debugger;
    $('#cancelEditTwt').on('click', handleCancelEditTwt);
}
export async function handleSendReply(event) {
    let id = $(event.target).closest('.card-body').attr('id');
    const result = await axios({
        method: 'post',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
          "type": "reply",
          "parent": id,
          "body": $('#editTwtBody').val(),
        },
    });
    $('#editTweetPls').replaceWith(unrenderEdit);
}
export async function handleSendRt(event) {
    let orig = $(event.target).closest('.card').find('.twt-bdy').html();
    let add = $('#editTwtBody').val();
    let body = add + " ~ "  + orig + " ~ ";
    let id = $(event.target).closest('.card-body').attr('id');
    const result = await axios({
        method: 'post',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
          "type": "retweet",
          "parent": id,
          body,
        },
      });
      $('#editTweetPls').replaceWith(unrenderEdit);
}
export const handleCancelEditTwt = function() {
    $('#editTweetPls').replaceWith(unrenderEdit);
}
export const unrenderEdit = function() {
    return `
        <div class='editDiv'> </div>
    `;
}
export const renderEditTwt = function(body) {
    return `
    <div class="row" id="editTweetPls">
    <textarea id="editTwtBody" rows="4" cols="50"></textarea>
    <button class="btn btn-primary" id="sendEditTwt">Send</button>
    <button class="btn btn-danger" id="cancelEditTwt">Cancel</button>
    </div>
    `;
} 
export const handleWriteTweet = function() {
    $('#form').replaceWith(renderWriteTweet());
    $('#cancelTweet').on('click', handleCancelTweet);
    $('#sendTweet').on('click', handleSendTweet);
}
export const renderWriteTweet = function() {
    return `
    <div class="row" id="writeTweet">
    <textarea id="tweetBody" rows="4" cols="50">hello, world</textarea>
    <button class="btn btn-primary" id="sendTweet">Send</button>
    <button class="btn btn-danger" id="cancelTweet">Cancel</button>
    </div>
    `;
}
export const handleCancelTweet = function() {
    $('#writeTweet').replaceWith(unrenderWrite());
}
export const unrenderWrite = function() {
    return `<div id="form"></div>`;
}
export async function handleSendTweet() {
    const result = await axios({
        method: 'post',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
          body: $('#tweetBody').val(),
        },
    });
    $('#writeTweet').replaceWith(unrenderWrite());
}
// execute following functions after page load
$(function() {
    renderFeed();
    $('#writeBtn').on('click', handleWriteTweet);
});