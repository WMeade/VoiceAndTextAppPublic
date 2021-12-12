const http = require('http');
const { Server } = require("socket.io");
const imt = {inviteManagement} = require('./inviteManagement');
const PORT = process.env.PORT || 3000;
const dbi = {loginSignup} = require('./loginSignup');
const msg = {messaging} = require('./messaging')
 
var users = {}

function runSockets(app){

    const server = http.createServer(app);
    const io = new Server(server);

    io.on('connection', (socket) => {  
    
        socket.on('usernameSearch', (username) => {
            if(username != ""){
                dbi.getUsers(username).then((results) => {
                    var searchResults = []
                    results.forEach((value) => {
                       searchResults.push(value["username"])
                    })
                    socket.emit('userSearchResults', searchResults)
                })
            }
        })
    
        socket.on('friendRemoved', (information) => {
            imt.deleteFriend(information[0], information[1])
            if(information[1] in users){
                io.to(users[information[1]]).emit('beenRemoved', information[0])  
            }
        })
    
        socket.on('acceptFriendRequest', (friendRequestInformation) => {
            imt.addFriends(friendRequestInformation)
            imt.deleteFriendInvite(friendRequestInformation[0], friendRequestInformation[1])
            if(friendRequestInformation[0] in users){
                io.to(users[friendRequestInformation[0]]).emit('friendAdded', [friendRequestInformation[1].requester, false])  
            }
            if(friendRequestInformation[1].requester in users){
                io.to(users[friendRequestInformation[1].requester]).emit('friendAdded', [friendRequestInformation[0], true])  
            }
        })
    
        socket.on('deleteInvite', (inviteInformation) => {
            if(inviteInformation[1].requester in users){
                io.to(users[inviteInformation[1].requester]).emit('inviteDeclined', inviteInformation[0])  
            }
            imt.deleteFriendInvite(inviteInformation[0], inviteInformation[1])
        })
    
        socket.on('username', (name) => {
            socket.name = name
            users[name] = socket.id
            console.log()
            console.log(users)
            console.log("\n" + name + ' : connected, socket id: ' + socket.id);
            io.emit("usersOnline", users)
        })
    
        socket.on('sendFriendRequest', (requestInformation) => {
            var invite = {type: "FriendRequest", requester: requestInformation[1]}
            
            if(requestInformation[0] in users){
                io.to(users[requestInformation[0]]).emit('incomingInvite', invite)  
            }
            imt.addFriendInvite(requestInformation[0], invite)
        })

        socket.on('sendMessage', (messageInformation) => {
            if(messageInformation[0] in users){
                io.to(users[messageInformation[0]]).emit('incomingMessage', messageInformation[1])
            }
            msg.addMessage(messageInformation)
        })

        socket.on("deleteMessage", (messageInformation) => {
            if(messageInformation[0] in users){
                io.to(users[messageInformation[0]]).emit('deletedMessage', messageInformation)
            }
            msg.deleteMessage(messageInformation)
        })

        socket.on("updateMessages", (messageSeenInfo) => {
            msg.updateMessages(messageSeenInfo)
        })
    
        socket.on("disconnect", () => {
            socket.removeAllListeners();
            console.log("\n" + socket.name + " : disconnected, socket id: " + socket.id); 
            delete users[socket.name]
            console.log()
            console.log(users)
            io.emit("userOffline", socket.name)
            io.emit("usersOnline", users)
        })
    });
    
    server.listen(PORT)
}

module.exports = {runSockets}