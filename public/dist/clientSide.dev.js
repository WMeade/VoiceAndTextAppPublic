"use strict";

var socket = io({
  transports: ['websocket'],
  upgrade: false
});
socket.emit('username', loggedArray.username);
socket.on('userSearchResults', function (results) {
  results.forEach(function (element) {
    var newContent = document.createElement('div');
    newContent.innerHTML = "\n             <div class='row mt-2'>\n                 <div class='card text-light mx-auto col-11' style='background-color: #202225;'>\n                     <div class='card-body'>\n                         <div class='row'> \n                             <div class='col-8'> \n                                 <h5 class='card-title mt-3 ml-4'>".concat(element, "</h5>\n                             </div>\n                             <div class='col-4'>\n                                 <button class='btn btn-success mt-2' onclick=\"emitFriendRequest('").concat(element, "')\">\n                                     Add friend \n                                 </buttons>\n                             </div>\n                         </div>\n                     </div>\n                 </div>\n             </div>");

    if (loggedArray.friends.find(function (friend) {
      return friend.username === element;
    }) == undefined && element != loggedArray.username) {
      document.getElementById("results").appendChild(newContent);
    }
  });
});

function getInvites() {
  var invitesElement = document.getElementById("resultsInvites");
  invitesElement.innerHTML = "";
  loggedArray.invites.forEach(function (invite) {
    var newContent = document.createElement('div');
    newContent.innerHTML = "\n          <div class='row mt-2'>\n             <div class='card text-light mx-auto col-11' style='background-color: #202225;'>\n                 <div class='card-body'>\n                     <div class='row'> \n                         <div class='col-8'> \n                             <h5 class='card-title mt-4'>Friend invite from: ".concat(invite.requester, "</h5>\n                         </div>\n                         <div class='col-4'>\n                             <div class=\"row\">\n                                 <button class='btn btn-block btn-success mt-2' onclick=\"acceptfriendInvite('").concat(invite.requester, "')\">\n                                     Accept \n                                 </buttons>\n                             </div>\n                             <div class=\"row\">\n                                 <button class='btn btn-block btn-danger mt-2' onclick=\"deleteInvite('").concat(invite.requester, "')\">\n                                     Decline\n                                 </buttons>\n                             <div>\n                         </div>\n                     </div>\n                 </div>\n             </div>\n         </div>");
    invitesElement.appendChild(newContent);
  });
}

socket.on("usersOnline", function (user) {
  loggedArray.friends.forEach(function (friend) {
    if (friend.username in user) {
      document.getElementById(friend.username).innerHTML = "Online\xA0<span id=\"".concat(friend.username, "04\" class='badge badge-pill badge-success'>\xA0</span>");
    } else {
      document.getElementById(friend.username).innerHTML = "Offline\xA0<span id=\"".concat(friend.username, "04\" class='badge badge-pill badge-danger'>\xA0</span>");
    }
  });
});
socket.on("userOffline", function (user) {
  loggedArray.friends.forEach(function (friend) {
    if (friend.username == user) {
      document.getElementById(friend.username).innerHTML = "Offline\xA0<span id=\"".concat(friend.username, "04\" class='badge badge-pill badge-danger'>\xA0</span>");
    }
  });
});

function getFriends() {
  document.getElementById("mainList").innerHTML = "";
  loggedArray.friends.forEach(function (friend) {
    var newContent = document.createElement('div');
    newContent.innerHTML = "\n            <div class=\"dropright\" id=\"".concat(friend.username, "01\">\n             <button href=\"#\" class=\"list-group-item list-group-item-action text-light ml-2 mt-2\"  id=\"dropdownMenuButton\"  data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" style=\"background-color: #40444b; width: 100%;\">\n                <div class=\"d-flex w-100 justify-content-between\">\n                    <h5 class=\"mb-1\"> ").concat(friend.username, " <span class=\"badge badge-light ml-2\" id=\"unseenMess").concat(friend.username, "\">0</span> </h5>\n                    <small class=\"mt-1\" id=\"").concat(friend.username, "\">Online\xA0<span id=\"").concat(friend.username, "04\" class=\"badge badge-pill badge-success\">\xA0</span></small>\n                </div>\n                <div class=\"dropdown-menu ml-2\"  style=\"background-color:#40444b;\" aria-labelledby=\"dropdownMenuButton\">\n                     <h4 class=\"dropdown-header text-white\">").concat(friend.username, "</h4>\n                     <a class=\"dropdown-item text-white\" style=\"background-color:#40444b;\" onclick=\"messageFriend('").concat(friend.username, "')\">Message</a>\n                     <div class=\"dropdown-divider\"></div>\n                     <a class=\"dropdown-item text-white bg-danger\" onclick=\"removeFriend('").concat(friend.username, "')\">Remove friend</a>\n                 </div>\n            </button>\n            </div>");
    document.getElementById("mainList").appendChild(newContent);
    var unseen = 0;
    friend.messages.forEach(function (message) {
      if (!message.seen && message.username != loggedArray.username) {
        unseen += 1;
      }
    });
    document.getElementById("unseenMess" + friend.username).innerHTML = unseen;
  });
}

document.getElementById('usernamedisplay').innerHTML = loggedArray.username;
document.getElementById("inviteNotifs").innerHTML = loggedArray.invites.length;
socket.on('incomingInvite', function (invite) {
  if (loggedArray.invites.filter(function (extinvite) {
    return extinvite.requester === invite.requester;
  }).length <= 0) {
    loggedArray.invites.push(invite);
    var notification = document.createElement('div');
    notification.id = invite.requester + "02";
    notification.innerHTML = "\n             <div class=\"alert alert-primary text-dark\" mt-2 role=\"alert\" aria-live=\"assertive\" aria-atomic=\"true\">\n                 <div class=\"toast-header\">\n                     <strong class=\"mr-auto\">Friend invite</strong>\n                     <button type=\"button\" class=\"ml-2 mb-1 close\" data-dismiss=\"toast\" aria-label=\"Close\" onclick=\"document.getElementById('".concat(invite.requester, "02').parentNode.removeChild(document.getElementById('").concat(invite.requester, "02'))\">\n                         <span aria-hidden=\"true\">&times;</span>\n                     </button>\n                 </div>\n                 <div class=\"toast-body\">\n                     ").concat(invite.requester, " wants to be your friend!\n                 </div>\n             </div>\n         ");
    document.getElementById("liveNotifications").appendChild(notification);
    getInvites();
    document.getElementById("inviteNotifs").innerHTML = loggedArray.invites.length;
  }
});
socket.on('inviteDeclined', function (username) {
  var notification = document.createElement('div');
  notification.id = username + "02";
  notification.innerHTML = "\n             <div class=\"alert alert-danger text-dark\" mt-2 role=\"alert\" aria-live=\"assertive\" aria-atomic=\"true\">\n                 <div class=\"toast-header\">\n                     <strong class=\"mr-auto\">Friend invite</strong>\n                     <button type=\"button\" class=\"ml-2 mb-1 close\" data-dismiss=\"toast\" aria-label=\"Close\" onclick=\"document.getElementById('".concat(username, "02').parentNode.removeChild(document.getElementById('").concat(username, "02'))\">\n                         <span aria-hidden=\"true\">&times;</span>\n                     </button>\n                 </div>\n                 <div class=\"toast-body\">\n                     ").concat(username, " declined your request!\n                 </div>\n             </div>\n         ");
  document.getElementById("liveNotifications").appendChild(notification);
});

function getMessages(username) {
  var friend = loggedArray.friends.find(function (friend) {
    return friend.username === username;
  });
  var messageList = document.getElementById("mainMessageList" + username);
  var messageIndex = 0;

  if (messageList != null) {
    friend.messages.forEach(function (message) {
      var currentMessage = document.createElement('div');

      if (!message.seen) {
        var mess = friend.messages.findIndex(function (mess) {
          return mess == message;
        });
        friend.messages[mess].seen = true;
      }

      if (document.getElementById(username + "Message" + messageIndex) == null) {
        currentMessage.id = username + "Message" + messageIndex;
        currentMessage.innerHTML = " <p style=\"margin-top: 1em; margin-bottom: -0.6em; margin-right: 3em;\">".concat(message.time.slice(0, 21), "</p><li class=\"list-group-item text-white bg-dark mt-2\">").concat(message.username, " : ").concat(message.message);

        if (message.username == loggedArray.username) {
          currentMessage.innerHTML = currentMessage.innerHTML + "<button class=\"btn btn-danger text-white\" style=\"margin-top:-2.65em; margin-left:-2em\" onclick=\"deleteMessage('".concat(friend.username, "', '").concat(message.time, "', '").concat(message.message, "', '").concat(messageIndex, "')\">X</button> </li>");
        } else {
          currentMessage.innerHTML = currentMessage.innerHTML + "</li>";
        }

        if (messageList != null) {
          messageList.appendChild(currentMessage);
        }
      }

      messageIndex += 1;
    });
  }

  socket.emit("updateMessages", [loggedArray.username, friend.messages]);
  document.getElementById("unseenMess" + friend.username).innerHTML = 0;
  var overBox = document.getElementById("overflowBox");
  overBox.scrollTop = overBox.scrollHeight;
}

getInvites();
getFriends();
socket.on('friendAdded', function (usernameFriend) {
  loggedArray.friends.push({
    username: usernameFriend[0],
    messages: []
  });

  if (usernameFriend[1]) {
    var notification = document.createElement('div');
    notification.id = usernameFriend[0] + "02";
    notification.innerHTML = "\n             <div class=\"alert alert-info text-dark\" mt-2 role=\"alert\" aria-live=\"assertive\" aria-atomic=\"true\">\n                 <div class=\"toast-header\">\n                     <strong class=\"mr-auto\">Friend invite</strong>\n                     <button type=\"button\" class=\"ml-2 mb-1 close\" data-dismiss=\"toast\" aria-label=\"Close\" onclick=\"document.getElementById('".concat(usernameFriend[0], "02').parentNode.removeChild(document.getElementById('").concat(usernameFriend[0], "02'))\">\n                         <span aria-hidden=\"true\">&times;</span>\n                     </button>\n                 </div>\n                 <div class=\"toast-body\">\n                     ").concat(usernameFriend[0], " Accepted your friend request!\n                 </div>\n             </div>\n             ");
    document.getElementById("liveNotifications").appendChild(notification);
  }

  socket.emit('username', loggedArray.username);
  getFriends();
});
socket.on('beenRemoved', function (friend) {
  document.getElementById(friend + "01").parentNode.removeChild(document.getElementById(friend + "01"));
  var fri = loggedArray.friends.find(function (fri) {
    return fri.username === friend;
  });
  loggedArray.friends.splice(loggedArray.friends.indexOf(fri), 1);
});
socket.on('incomingMessage', function (messageInfo) {
  var friendThatSentMessage = loggedArray.friends.find(function (friend) {
    return friend.username === messageInfo.username;
  });
  friendThatSentMessage.messages.push(messageInfo);
  var notification = document.createElement('div');
  notification.id = messageInfo.username + "02";
  notification.innerHTML = "\n        <div class=\"alert alert-info text-dark\" mt-2 role=\"alert\" aria-live=\"assertive\" aria-atomic=\"true\">\n            <div class=\"toast-header\">\n                <strong class=\"mr-auto\">Recieved Message</strong>\n                <button type=\"button\" class=\"ml-2 mb-1 close\" data-dismiss=\"toast\" aria-label=\"Close\" onclick=\"document.getElementById('".concat(messageInfo.username, "02').parentNode.removeChild(document.getElementById('").concat(messageInfo.username, "02'))\">\n                    <span aria-hidden=\"true\">&times;</span>\n                </button>\n            </div>\n            <div class=\"toast-body\">\n                ").concat(messageInfo.username, " sent you a message!\n            </div>\n        </div>\n     ");

  if (document.getElementById(messageInfo.username + "03") == null) {
    document.getElementById("liveNotifications").appendChild(notification);
    document.getElementById("unseenMess" + messageInfo.username).innerHTML = parseInt(document.getElementById("unseenMess" + messageInfo.username).innerHTML) + 1;
  }

  getMessages(messageInfo.username);
});

function removeFriend(username) {
  document.getElementById(username + "01").parentNode.removeChild(document.getElementById(username + "01"));
  var fri = loggedArray.friends.find(function (fri) {
    return fri.username === username;
  });
  loggedArray.friends.splice(loggedArray.friends.indexOf(fri), 1);
  socket.emit('friendRemoved', [loggedArray.username, username]);
}

function deleteInvite(inviteForDelete) {
  inviteForDelete = loggedArray.invites.find(function (invite) {
    return invite.requester === inviteForDelete;
  });
  var informationForDelete = [loggedArray.username, inviteForDelete];
  loggedArray.invites.splice(loggedArray.invites.indexOf(inviteForDelete), 1);
  socket.emit('deleteInvite', informationForDelete);
  getInvites();
  document.getElementById("inviteNotifs").innerHTML = loggedArray.invites.length;
}

function acceptfriendInvite(inviteToAccept) {
  var inviteToAccept = loggedArray.invites.find(function (invite) {
    return invite.requester === inviteToAccept;
  });
  var informationForAccept = [loggedArray.username, inviteToAccept];
  loggedArray.invites.splice(loggedArray.invites.indexOf(inviteToAccept), 1);
  document.getElementById("inviteNotifs").innerHTML = loggedArray.invites.length;
  socket.emit('acceptFriendRequest', informationForAccept);
  getInvites();
}

function messageFriend(username) {
  if (document.getElementById("currentMessageBox") != null) {
    document.getElementById("currentMessageBox").parentNode.removeChild(document.getElementById("currentMessageBox"));
  }

  var messageBox = document.createElement('div');
  messageBox.id = "currentMessageBox";
  messageBox.innerHTML = "\n         <div class=\"jumbotron jumbotron-fluid\" style=\"margin-left: 45em; margin-bottom:1em; border-radius:8px;  min-width:50em; margin-top: -26vh; background-color:#40444b; margin-right: 1em;\"> \n             <button type=\"button\" style=\"margin-top:-0.4em; margin-right:1em;\" class=\"close\" data-dismiss=\"toast\" aria-label=\"Close\" onclick=\"closeMessageBox()\">\n                 <span aria-hidden=\"true\" class=\"text-white\">&times;</span>\n             </button>\n             <h3 style=\"margin-left: 1em; display:inline-block;\">".concat(username, "</h3>\n             <h5 style=\"margin-left: 0.5em; display:inline-block;\" id=\"").concat(username, "03\"></h5>\n             <hr class=\"my-4\">\n             <div style=\"height:50em; overflow-y: scroll;\" id=\"overflowBox\">\n                 <ul class=\"list-group col-11 mx-auto d-flex\" id=\"mainMessageList").concat(username, "\">\n                 </ul>\n             </div>\n             <hr class=\"my-4\"\n             <form>\n                 <div class=\"row d-flex\" style=\"max-width:100%;  min-width:40%;\">\n                     <input class=\"form-control text-white\" type=\"text\" style=\"background-color: #94969a; margin-left:2em;\" id=\"textBox\">\n                 </div>\n                 <div class=\"row d-flex\"  style=\"max-width:100%;  min-width:40%; margin-top:0.5em;\">\n                     <button class=\"btn btn-primary btn-block\" style=\"margin-left:2em; background-color: #016aa8;\" onclick=\"sendMessage('").concat(username, "')\"> Send </button>\n                 </div>\n             </form>\n         <div>\n     ");
  var online = document.getElementById(username + "04").cloneNode(true);
  document.getElementById("mainBody").appendChild(messageBox);
  var overBox = document.getElementById("overflowBox");
  overBox.scrollTop = overBox.scrollHeight;
  var span = document.getElementById(username + "03").appendChild(online);
  getMessages(username);
}

function closeMessageBox() {
  document.getElementById("currentMessageBox").parentNode.removeChild(document.getElementById("currentMessageBox"));
}

function deleteMessage(username, messageTime, messageContent, index) {
  var friend = loggedArray.friends.find(function (friend) {
    return friend.username === username;
  });
  var message = {
    username: loggedArray.username,
    message: messageContent,
    seen: true,
    time: messageTime
  };
  var messageInfo = [username, message, index];
  friend.messages.splice(index, 1);
  socket.emit("deleteMessage", messageInfo);
  document.getElementById(username + "Message" + index).remove();
  console.log(loggedArray);
}

socket.on('deletedMessage', function (messageInfo) {
  var friend = loggedArray.friends.find(function (friend) {
    return friend.username === messageInfo[1].username;
  });
  friend.messages.splice(messageInfo[2], 1);
  document.getElementById(messageInfo[1].username + "Message" + messageInfo[2]).remove();
  console.log(loggedArray);
});

function sendMessage(username) {
  var inputBox = document.getElementById("textBox");
  var message = {
    username: loggedArray.username,
    message: inputBox.value,
    seen: false,
    time: new Date().toString()
  };
  var messageInformation = [username, message];
  var friendToSendMessage = loggedArray.friends.find(function (friend) {
    return friend.username === username;
  });
  inputBox.value = "";
  friendToSendMessage.messages.push(message);
  socket.emit('sendMessage', messageInformation);
  getMessages(username);
}

function emitRequest() {
  document.getElementById("results").innerHTML = "";
  socket.emit('usernameSearch', document.getElementById("username").value);
}

function emitFriendRequest(Username) {
  var infoFrRequest = [Username, loggedArray.username];
  socket.emit('sendFriendRequest', infoFrRequest);
}