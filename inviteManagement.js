const { MongoClient, MongoRuntimeError } = require("mongodb");
const dbi = {loginSignup} = require('./loginSignup');
const utils = require('./utils');
 
var connection = dbi.client

async function addFriendInvite(Username, invite){
    try{
        const database = connection.db("users")
        const userInformation = database.collection("userInformation")
        
        console.log()
        await userInformation.updateOne(
                {username: Username}, 
                { $addToSet:{invites: invite}}
        ).then((result) => console.log(result))
    } catch (e) {
        console.error(e);
    }
};

async function deleteFriendInvite(Username, invite){
    try{
        const database = connection.db("users")
        const userInformation = database.collection("userInformation")
        await userInformation.updateOne(
                {username: Username}, 
                { $pull:{invites: invite}}
        ).then((result) => console.log(result))
    } catch (e) {
        console.error(e);
    }
};

async function deleteFriend(Username, friend){
    try{
        const database = connection.db("users")
        const userInformation = database.collection("userInformation")
        await userInformation.updateOne(
                {username: friend}, 
                { $pull:{friends:{username: Username}}}
        ).then((result) => console.log(result))

        console.log()
        await userInformation.updateOne(
            {username: Username}, 
            { $pull:{friends:{username: friend}}}
        ).then((result) => console.log(result))

        console.log()
    } catch (e) {
        console.error(e);
    }
};

async function addFriends(AcceptInformation){
    try{    
        const database = connection.db("users")
        const userInformation = database.collection("userInformation")

        var friend = {username:AcceptInformation[1].requester, messages:[]}

        await userInformation.updateOne(
            {username: AcceptInformation[0]}, 
            {$addToSet:{friends:friend}}
        ).then((result) => console.log(result))
        
        friend = {username:AcceptInformation[0], messages:[]}
  
        console.log()
        await userInformation.updateOne(
            {username: AcceptInformation[1].requester}, 
            {$addToSet:{friends:friend}}
        ).then((result) => console.log(result))

        console.log()
    } catch (e) {
        console.error(e);
    }
};


module.exports = {addFriendInvite, deleteFriendInvite, addFriends, deleteFriend}
