const { MongoClient, MongoRuntimeError } = require("mongodb");
const dbi = {loginSignup} = require('./loginSignup');
const utils = require('./utils');
var connection = dbi.client

async function addMessage(messageInformation){
    try{    
        
        const database = connection.db("users")
        const userInformation = database.collection("userInformation")

        console.log()
        await userInformation.updateOne(
            {username: messageInformation[0], "friends.username":messageInformation[1].username}, 
            {$push:{"friends.$.messages": messageInformation[1]}}
        ).then((result) => console.log(result))
        
        console.log()
        await userInformation.updateOne(
            {username: messageInformation[1].username, "friends.username":messageInformation[0]}, 
            {$push:{"friends.$.messages": messageInformation[1]}}
        ).then((result) => console.log(result))

    } catch (e) {
        console.error(e);
    }
}

async function updateMessages(updatedMessages){
    try{    
        const database = connection.db("users")
        const userInformation = database.collection("userInformation")
        console.log()
        await userInformation.updateOne(
            {username: updatedMessages[0]},
            {$set:{"friends.$[i].messages" : updatedMessages[1]}},
            { arrayFilters: [
            {
                "i.username": updatedMessages[1][0].username
            }
            ]}
            ).then((result) => console.log(result))
            
        console.log()
        await userInformation.updateOne(
            {username: updatedMessages[1][0].username}, 
            {$set:{"friends.$[i].messages" : updatedMessages[1]}},
            { arrayFilters: [
            {
                "i.username": updatedMessages[0]
            }
            ]}
        ).then((result) => console.log(result))
    
    } catch (e) {
        console.log()
    }
}

async function deleteMessage(messageInformation){
    try{    
        const database = connection.db("users")
        const userInformation = database.collection("userInformation")

        console.log()
        await userInformation.updateOne(
            {username: messageInformation[0], "friends.username":messageInformation[1].username}, 
            {$pull:{"friends.$.messages": messageInformation[1]}}
        ).then((result) => console.log(result))
         
        console.log()
        await userInformation.updateOne(
            {username: messageInformation[1].username, "friends.username":messageInformation[0]}, 
            {$pull:{"friends.$.messages": messageInformation[1]}}
        ).then((result) => console.log(result))

        console.log()
    } catch (e) {
        console.error(e);
    }
}

module.exports = {addMessage, updateMessages, deleteMessage}