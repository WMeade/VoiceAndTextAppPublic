
var socket = io({transports: ['websocket'], upgrade: false});
 
socket.emit('username', loggedArray.username)
 
socket.on('userSearchResults', (results) => {
     results.forEach(element => {
         var newContent = document.createElement('div')
         newContent.innerHTML = `
             <div class='row mt-2'>
                 <div class='card text-light mx-auto col-11' style='background-color: #202225;'>
                     <div class='card-body'>
                         <div class='row'> 
                             <div class='col-8'> 
                                 <h5 class='card-title mt-3 ml-4'>${element}</h5>
                             </div>
                             <div class='col-4'>
                                 <button class='btn btn-success mt-2' onclick="emitFriendRequest('${element}')">
                                     Add friend 
                                 </buttons>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>`
         if(loggedArray.friends.find((friend) => friend.username === element) == undefined&&element != loggedArray.username){
             document.getElementById("results").appendChild(newContent)
         }
     });
})
 

function getInvites(){
     var invitesElement = document.getElementById("resultsInvites")
     invitesElement.innerHTML = ""
     loggedArray.invites.forEach(invite => {
         var newContent = document.createElement('div')
         newContent.innerHTML = `
          <div class='row mt-2'>
             <div class='card text-light mx-auto col-11' style='background-color: #202225;'>
                 <div class='card-body'>
                     <div class='row'> 
                         <div class='col-8'> 
                             <h5 class='card-title mt-4'>Friend invite from: ${invite.requester}</h5>
                         </div>
                         <div class='col-4'>
                             <div class="row">
                                 <button class='btn btn-block btn-success mt-2' onclick="acceptfriendInvite('${invite.requester}')">
                                     Accept 
                                 </buttons>
                             </div>
                             <div class="row">
                                 <button class='btn btn-block btn-danger mt-2' onclick="deleteInvite('${invite.requester}')">
                                     Decline
                                 </buttons>
                             <div>
                         </div>
                     </div>
                 </div>
             </div>
         </div>`
         invitesElement.appendChild(newContent)
     })
}
 
socket.on("usersOnline", (user) => {
     loggedArray.friends.forEach((friend) => {
         if(friend.username in user){
             document.getElementById(friend.username).innerHTML = `Online\xa0\<span id="${friend.username}04" class='badge badge-pill badge-success'>\xa0\</span>`
         }else{
             document.getElementById(friend.username).innerHTML = `Offline\xa0\<span id="${friend.username}04" class='badge badge-pill badge-danger'>\xa0\</span>`
         }
     })
})

socket.on("userOffline", (user) => {
     loggedArray.friends.forEach((friend) => {
         if(friend.username == user){
             document.getElementById(friend.username).innerHTML = `Offline\xa0\<span id="${friend.username}04" class='badge badge-pill badge-danger'>\xa0\</span>`
         }
     })
})

function getFriends(){
     document.getElementById("mainList").innerHTML = ""
     loggedArray.friends.forEach((friend) => {
        
        var newContent = document.createElement('div')
        
        newContent.innerHTML = `
            <div class="dropright" id="${friend.username}01">
             <button href="#" class="list-group-item list-group-item-action text-light ml-2 mt-2"  id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="background-color: #40444b; width: 100%;">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1"> ${friend.username} <span class="badge badge-light ml-2" id="unseenMess${friend.username}">0</span> </h5>
                    <small class="mt-1" id="${friend.username}">Online\xa0\<span id="${friend.username}04" class="badge badge-pill badge-success">\xa0\</span></small>
                </div>
                <div class="dropdown-menu ml-2"  style="background-color:#40444b;" aria-labelledby="dropdownMenuButton">
                     <h4 class="dropdown-header text-white">${friend.username}</h4>
                     <a class="dropdown-item text-white" style="background-color:#40444b;" onclick="messageFriend('${friend.username}')">Message</a>
                     <div class="dropdown-divider"></div>
                     <a class="dropdown-item text-white bg-danger" onclick="removeFriend('${friend.username}')">Remove friend</a>
                 </div>
            </button>
            </div>`
        
         
        document.getElementById("mainList").appendChild(newContent)
        var unseen = 0
        friend.messages.forEach((message) => {
            if(!message.seen && message.username != loggedArray.username){
                unseen += 1
            }
        })
        document.getElementById("unseenMess" + friend.username).innerHTML = unseen
    })
}



document.getElementById('usernamedisplay').innerHTML = loggedArray.username

document.getElementById("inviteNotifs").innerHTML = loggedArray.invites.length

socket.on('incomingInvite', (invite) => {
     if(loggedArray.invites.filter(extinvite => extinvite.requester === invite.requester).length <= 0){
         loggedArray.invites.push(invite)
         var notification = document.createElement('div')
         notification.id=invite.requester + "02"
         notification.innerHTML = `
             <div class="alert alert-primary text-dark" mt-2 role="alert" aria-live="assertive" aria-atomic="true">
                 <div class="toast-header">
                     <strong class="mr-auto">Friend invite</strong>
                     <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close" onclick="document.getElementById(\'${invite.requester}02\').parentNode.removeChild(document.getElementById(\'${invite.requester}02\'))">
                         <span aria-hidden="true">&times;</span>
                     </button>
                 </div>
                 <div class="toast-body">
                     ${invite.requester} wants to be your friend!
                 </div>
             </div>
         `
         document.getElementById("liveNotifications").appendChild(notification)
         getInvites()
         document.getElementById("inviteNotifs").innerHTML = loggedArray.invites.length
     }
})

socket.on('inviteDeclined', (username) => {
         var notification = document.createElement('div')
         notification.id=username + "02"
         notification.innerHTML = `
             <div class="alert alert-danger text-dark" mt-2 role="alert" aria-live="assertive" aria-atomic="true">
                 <div class="toast-header">
                     <strong class="mr-auto">Friend invite</strong>
                     <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close" onclick="document.getElementById(\'${username}02\').parentNode.removeChild(document.getElementById(\'${username}02\'))">
                         <span aria-hidden="true">&times;</span>
                     </button>
                 </div>
                 <div class="toast-body">
                     ${username} declined your request!
                 </div>
             </div>
         `
         document.getElementById("liveNotifications").appendChild(notification)
})
 

function getMessages(username){
   var friend = loggedArray.friends.find(friend => friend.username === username);
   var messageList = document.getElementById("mainMessageList" + username)
   var messageIndex = 0
   if(messageList != null){
        friend.messages.forEach((message) => {
            var currentMessage = document.createElement('div')
        if(!message.seen){
            var mess = friend.messages.findIndex(mess => mess == message)
            friend.messages[mess].seen = true
        }
        if(document.getElementById(username + "Message" + messageIndex) == null){
            currentMessage.id = username + "Message" + messageIndex
            currentMessage.innerHTML = ` <p style="margin-top: 1em; margin-bottom: -0.6em; margin-right: 3em;">${message.time.slice(0, 21)}</p><li class="list-group-item text-white bg-dark mt-2">${message.username} : ${message.message}`
            if(message.username == loggedArray.username){
                currentMessage.innerHTML = currentMessage.innerHTML + `<button class="btn btn-danger text-white" style="margin-top:-2.65em; margin-left:-2em" onclick="deleteMessage('${friend.username}', '${message.time}', '${message.message}', '${messageIndex}')">X</button> </li>`
            }else{
                currentMessage.innerHTML = currentMessage.innerHTML + `</li>`
            }
            if(messageList != null){
                messageList.appendChild(currentMessage)
            }
        }
        messageIndex += 1
    })
   }
   
    socket.emit("updateMessages", [loggedArray.username ,friend.messages])
    document.getElementById("unseenMess" + friend.username).innerHTML = 0
    var overBox = document.getElementById("overflowBox")
    overBox.scrollTop = overBox.scrollHeight;
}

getInvites()
getFriends()

socket.on('friendAdded', (usernameFriend) => {
     loggedArray.friends.push({username: usernameFriend[0], messages: []})
     if(usernameFriend[1]){
         var notification = document.createElement('div')
         notification.id=usernameFriend[0] + "02"
         notification.innerHTML = `
             <div class="alert alert-info text-dark" mt-2 role="alert" aria-live="assertive" aria-atomic="true">
                 <div class="toast-header">
                     <strong class="mr-auto">Friend invite</strong>
                     <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close" onclick="document.getElementById(\'${usernameFriend[0]}02\').parentNode.removeChild(document.getElementById(\'${usernameFriend[0]}02\'))">
                         <span aria-hidden="true">&times;</span>
                     </button>
                 </div>
                 <div class="toast-body">
                     ${usernameFriend[0]} Accepted your friend request!
                 </div>
             </div>
             `
             document.getElementById("liveNotifications").appendChild(notification)
     }
     socket.emit('username', loggedArray.username);
     getFriends()               
})

socket.on('beenRemoved', (friend) =>{
     document.getElementById(friend + "01").parentNode.removeChild(document.getElementById(friend + "01"))
     var fri = loggedArray.friends.find((fri) => fri.username === friend)
     loggedArray.friends.splice(loggedArray.friends.indexOf(fri), 1)
})

socket.on('incomingMessage', (messageInfo) => {
    var friendThatSentMessage = loggedArray.friends.find((friend) => friend.username === messageInfo.username)
    friendThatSentMessage.messages.push(messageInfo)

    var notification = document.createElement('div')
    notification.id=messageInfo.username + "02"
    notification.innerHTML = `
        <div class="alert alert-info text-dark" mt-2 role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <strong class="mr-auto">Recieved Message</strong>
                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close" onclick="document.getElementById(\'${messageInfo.username}02\').parentNode.removeChild(document.getElementById(\'${messageInfo.username}02\'))">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="toast-body">
                ${messageInfo.username} sent you a message!
            </div>
        </div>
     `
   
    if(document.getElementById(messageInfo.username + "03") == null){
        document.getElementById("liveNotifications").appendChild(notification)
        document.getElementById("unseenMess" + messageInfo.username).innerHTML = parseInt(document.getElementById("unseenMess" + messageInfo.username).innerHTML) + 1
    }
  

    getMessages(messageInfo.username)
})


function removeFriend(username){
     document.getElementById(username + "01").parentNode.removeChild(document.getElementById(username + "01"))
     var fri = loggedArray.friends.find((fri) => fri.username === username)
     loggedArray.friends.splice(loggedArray.friends.indexOf(fri), 1)
     socket.emit('friendRemoved', [loggedArray.username, username]) 
}

function deleteInvite(inviteForDelete){
     inviteForDelete = loggedArray.invites.find((invite) => invite.requester === inviteForDelete)
     var informationForDelete = [loggedArray.username, inviteForDelete]
     loggedArray.invites.splice(loggedArray.invites.indexOf(inviteForDelete), 1)
     socket.emit('deleteInvite', informationForDelete)
     getInvites()
     document.getElementById("inviteNotifs").innerHTML = loggedArray.invites.length
}

function acceptfriendInvite(inviteToAccept){
     var inviteToAccept = loggedArray.invites.find((invite) => invite.requester === inviteToAccept)
     var informationForAccept = [loggedArray.username, inviteToAccept]
     loggedArray.invites.splice(loggedArray.invites.indexOf(inviteToAccept), 1)
     document.getElementById("inviteNotifs").innerHTML = loggedArray.invites.length
     socket.emit('acceptFriendRequest', informationForAccept)
     getInvites()
}

function messageFriend(username){
     if(document.getElementById("currentMessageBox") != null){
         document.getElementById("currentMessageBox").parentNode.removeChild(document.getElementById("currentMessageBox"))
     }
     var messageBox = document.createElement('div')
     messageBox.id = "currentMessageBox"
     messageBox.innerHTML = `
         <div class="jumbotron jumbotron-fluid" style="margin-left: 45em; margin-bottom:1em; border-radius:8px;  min-width:50em; margin-top: -26vh; background-color:#40444b; margin-right: 1em;"> 
             <button type="button" style="margin-top:-0.4em; margin-right:1em;" class="close" data-dismiss="toast" aria-label="Close" onclick="closeMessageBox()">
                 <span aria-hidden="true" class="text-white">&times;</span>
             </button>
             <h3 style="margin-left: 1em; display:inline-block;">${username}</h3>
             <h5 style="margin-left: 0.5em; display:inline-block;" id="${username}03"></h5>
             <hr class="my-4">
             <div style="height:50em; overflow-y: scroll;" id="overflowBox">
                 <ul class="list-group col-11 mx-auto d-flex" id="mainMessageList${username}">
                 </ul>
             </div>
             <hr class="my-4"
             <form>
                 <div class="row d-flex" style="max-width:100%;  min-width:40%;">
                     <input class="form-control text-white" type="text" style="background-color: #94969a; margin-left:2em;" id="textBox">
                 </div>
                 <div class="row d-flex"  style="max-width:100%;  min-width:40%; margin-top:0.5em;">
                     <button class="btn btn-primary btn-block" style="margin-left:2em; background-color: #016aa8;" onclick="sendMessage('${username}')"> Send </button>
                 </div>
             </form>
         <div>
     `
     var online = document.getElementById(username + "04").cloneNode(true)
     
     document.getElementById("mainBody").appendChild(messageBox)
    
     var overBox = document.getElementById("overflowBox")
     overBox.scrollTop = overBox.scrollHeight;
     var span = document.getElementById(username + "03").appendChild(online)
     getMessages(username)
}

function closeMessageBox(){
     document.getElementById("currentMessageBox").parentNode.removeChild(document.getElementById("currentMessageBox"))
}

function deleteMessage(username, messageTime, messageContent, index){
    var friend = loggedArray.friends.find((friend) => friend.username === username)
    var message = {username: loggedArray.username, message: messageContent, seen: true, time: messageTime}
    var messageInfo = [username, message, index]
    friend.messages.splice(index, 1)
    socket.emit("deleteMessage", messageInfo)
    document.getElementById(username + "Message" + index).remove()
    console.log(loggedArray)
}

socket.on('deletedMessage', (messageInfo) => {
    var friend = loggedArray.friends.find((friend) => friend.username === messageInfo[1].username)
    friend.messages.splice(messageInfo[2], 1)
    document.getElementById(messageInfo[1].username + "Message" + messageInfo[2]).remove()
    console.log(loggedArray)
})

function sendMessage(username){
     var inputBox = document.getElementById("textBox")
     var message = {username: loggedArray.username, message: inputBox.value, seen: false, time: new Date().toString()}
     var messageInformation = [username, message]
     var friendToSendMessage = loggedArray.friends.find((friend) => friend.username === username)
     inputBox.value = ""
     friendToSendMessage.messages.push(message)
     socket.emit('sendMessage', messageInformation)
     getMessages(username)
}

function emitRequest(){
     document.getElementById("results").innerHTML = ""
     socket.emit('usernameSearch', document.getElementById("username").value)
}

function emitFriendRequest(Username){
     var infoFrRequest = [Username, loggedArray.username]
     socket.emit('sendFriendRequest', infoFrRequest)
}