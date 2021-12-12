
var loggedArray = <%-JSON.stringify(userinformation)%>
console.log(loggedArray)

var socket = io();
 
socket.emit('username', loggedArray.username)
 
 socket.on('username', (name) => {
     if(name != loggedArray[0]){
         console.log(name)
     }
 })

 socket.on('userSearchResults', (results) => {
     var existingFriends = loggedArray["friends"]
     results.forEach(element => {
         var newContent = document.createElement('div')
         newContent.innerHTML = "<div class='row mt-2'><div class='card bg-dark text-light'><div class='card-body'> <h5 class='card-title'> " + element + "   </h5></div></div></div> "
         if(existingFriends.length > 0){
             existingFriends.forEach(friend =>{
                 if(friend["username"] != element){
                     document.getElementById("results").appendChild(newContent) 
                 }
             })
         }else{
             document.getElementById("results").appendChild(newContent) 
         }
     });
 })
 
 socket.on("userOnline", (name) => {if(loggedArray.friends.includes(name)) { }})

 document.getElementById('usernamedisplay').innerHTML = loggedArray.username + '  <a href="\logout"><img src="/images/logout.png" alt="logout"></a>'

 function emitRequest(){
     document.getElementById("results").innerHTML = ""
     socket.emit('usernameSearch', document.getElementById("username").value)
 }
