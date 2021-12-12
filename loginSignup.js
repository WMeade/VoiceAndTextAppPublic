const { MongoClient, MongoRuntimeError } = require("mongodb");
const { now } = require("mongoose");
const client = new MongoClient(@voiceappproject.ufffs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useUnifiedTopology: true});
const uuid = require('uuid');
const auth  = require('./auth');
const utils = require('./utils');
const fs = require('fs')
client.connect();

async function addUser(Email, Username, Password, res){
    try{
        const database = client.db("users")
        const userInformation = database.collection("userInformation")
        
        var confirmationCode = uuid.v4()
        
        var findExisting = await userInformation.findOne({
            confirmationCode:confirmationCode
        }).then(function(findExisting) {
            while(findExisting != null){
                confirmationCode = uuid.v4()
                findExisting = userInformation.findOne({
                    confirmationCode:confirmationCode
                })
            };
        })
        
        await userInformation.insertOne({
            username:Username, 
            password:Password, 
            email:Email, 
            servers:[], 
            friends:[], 
            invites:[], 
            confirmationCode:confirmationCode, 
            accountActive:false,
            creation_date: new Date()
        })

        auth.verifyEmail(Email, Username, confirmationCode, res)
    
    } catch (e) {
        console.error(e);
    }
};

async function getUser(Username){
    try{
        const database = client.db("users")
        const userInformation = database.collection("userInformation")
        const findExisting = await userInformation.findOne({
            username: Username,
        })

        if(findExisting == null){
            return null
        }else{
            return findExisting
        }
    } catch (e) {
        console.error(e);
    }
};

async function getUsers(Username){
    try{
        const database = client.db("users")
        const userInformation = database.collection("userInformation")
        const findExisting =await userInformation.find({username: new RegExp(Username, 'i')}).toArray()
          
        if(findExisting == null){
            return null
        }else{
            return findExisting
        }
    } catch (e) {
        console.error(e);
    }
};


async function validateUser(Username, Password){
    try{
        const database = client.db("users")
        const userInformation = database.collection("userInformation")
        const findExisting = await userInformation.findOne({
            username: Username,
            password: Password
        })

        if(findExisting == null||Username == null|| Password == null){
            return false
        }else{
            if(findExisting["accountActive"] == false){
                return "AccountInactive"
            }
            return true
        }
    } catch (e) {
        console.error(e);
    }
};



async function signUp(Email, Username, Password, res){
    try{
        const database = client.db("users")
        const userInformation = database.collection("userInformation")
        const findExisting = await userInformation.findOne({
            $or: [{ email: Email }, { username: Username }]
        }).then(function(findExisting) {
            if(findExisting != null){
                if(Username == findExisting["username"]||Email == findExisting["email"]){
                    res.sendFile('views/signuperrorname.html', {root: __dirname })
                }
            }else{
                if(Email == "" || Username == "" || Password == ""){
                    res.sendFile('views/signuperrorname.html', {root: __dirname })
                }else{
                    addUser(Email, Username, Password, res)
                }
            }
        })
     
    }catch (e) {
        console.error(e);
    }
}

async function deleteInactiveUsersandCookies(){
    while(true){
        try{
            await utils.sleep(1800000)
            const databaseOne = client.db("users")
            const userInformation = databaseOne.collection("userInformation")
           
            date = new Date()
            date = utils.subtractTimeFromDate(date, 1)

            dateTwo = new Date()
            dateTwo = utils.subtractTimeFromDate(dateTwo, 24)
           
            const findExisting = await userInformation.deleteMany({
                creation_date: {$lte:date}
            })

            console.log("\nDeletion time: " + date)
            process.stdout.write("Deleted users: ")
            console.log(findExisting)
 
            const content = `\nDeletion time: ${date}\nDeleted users: ${findExisting.deletedCount}\n`
            fs.appendFileSync('./logs/deletionLog.txt', content)
        }catch (e) {
            console.error(e);
        }
    }
 
}
module.exports = { addUser, getUser, validateUser, signUp, deleteInactiveUsersandCookies, getUsers, client};