"use strict";

var _require2, _require3, _require4;

var http = require('http');

var _require = require("socket.io"),
    Server = _require.Server;

var imt = (_require2 = require('./inviteManagement'), inviteManagement = _require2.inviteManagement, _require2);
var PORT = process.env.PORT || 3000;
var dbi = (_require3 = require('./loginSignup'), loginSignup = _require3.loginSignup, _require3);
var msg = (_require4 = require('./messaging'), messaging = _require4.messaging, _require4);
var users = {};

function runSockets(app) {
  var server = http.createServer(app);
  var io = new Server(server);
  io.on('connection', function (socket) {
    socket.on('usernameSearch', function (username) {
      if (username != "") {
        dbi.getUsers(username).then(function (results) {
          var searchResults = [];
          results.forEach(function (value) {
            searchResults.push(value["username"]);
          });
          socket.emit('userSearchResults', searchResults);
        });
      }
    });
    socket.on('friendRemoved', function (information) {
      imt.deleteFriend(information[0], information[1]);

      if (information[1] in users) {
        io.to(users[information[1]]).emit('beenRemoved', information[0]);
      }
    });
    socket.on('acceptFriendRequest', function (friendRequestInformation) {
      imt.addFriends(friendRequestInformation);
      imt.deleteFriendInvite(friendRequestInformation[0], friendRequestInformation[1]);

      if (friendRequestInformation[0] in users) {
        io.to(users[friendRequestInformation[0]]).emit('friendAdded', [friendRequestInformation[1].requester, false]);
      }

      if (friendRequestInformation[1].requester in users) {
        io.to(users[friendRequestInformation[1].requester]).emit('friendAdded', [friendRequestInformation[0], true]);
      }
    });
    socket.on('deleteInvite', function (inviteInformation) {
      if (inviteInformation[1].requester in users) {
        io.to(users[inviteInformation[1].requester]).emit('inviteDeclined', inviteInformation[0]);
      }

      imt.deleteFriendInvite(inviteInformation[0], inviteInformation[1]);
    });
    socket.on('username', function (name) {
      socket.name = name;
      users[name] = socket.id;
      console.log();
      console.log(users);
      console.log("\n" + name + ' : connected, socket id: ' + socket.id);
      io.emit("usersOnline", users);
    });
    socket.on('sendFriendRequest', function (requestInformation) {
      var invite = {
        type: "FriendRequest",
        requester: requestInformation[1]
      };

      if (requestInformation[0] in users) {
        io.to(users[requestInformation[0]]).emit('incomingInvite', invite);
      }

      imt.addFriendInvite(requestInformation[0], invite);
    });
    socket.on('sendMessage', function (messageInformation) {
      if (messageInformation[0] in users) {
        io.to(users[messageInformation[0]]).emit('incomingMessage', messageInformation[1]);
      }

      msg.addMessage(messageInformation);
    });
    socket.on("deleteMessage", function (messageInformation) {
      if (messageInformation[0] in users) {
        io.to(users[messageInformation[0]]).emit('deletedMessage', messageInformation);
      }

      msg.deleteMessage(messageInformation);
    });
    socket.on("updateMessages", function (messageSeenInfo) {
      msg.updateMessages(messageSeenInfo);
    });
    socket.on("disconnect", function () {
      socket.removeAllListeners();
      console.log("\n" + socket.name + " : disconnected, socket id: " + socket.id);
      delete users[socket.name];
      console.log();
      console.log(users);
      io.emit("userOffline", socket.name);
      io.emit("usersOnline", users);
    });
  });
  server.listen(PORT);
}

module.exports = {
  runSockets: runSockets
};