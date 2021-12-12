
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const uuid = require('uuid');
const dbi = {loginSignup} = require('./loginSignup');
const auth  = require('./auth');
const express = require('express');
const app = express();
const oneDay = 1000 * 60 * 60 * 24
const ssrv = {socketServer} = require('./socketServer');

mongoose.connect('mongodb+srv://@voiceappproject.ufffs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{useNewUrlParser:true})
var conn = mongoose.connection

conn.on('connected',()=>{
    console.log('MongoDB connected')
})

dbi.deleteInactiveUsersandCookies()

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.use(sessions({
    secret: uuid.v4(),
    saveUninitialized:true,
    cookie: { maxAge: oneDay, secure:false, sameSite:'strict' },
    resave: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://wmeade:TechnoLmao231624@voiceappproject.ufffs.mongodb.net/UserSessions?retryWrites=true&w=majority'
    }),
}))

app.get("/confirm/:confirmationCode", (req, res) => {
    auth.confirmUser(req, res)
})

app.post("/accountVerification", (req, res) => {
    if(req.body.password != req.body.passwordConfirm){
        res.sendFile('views/signuperrorpassword.html', {root: __dirname })
    }else{
        dbi.signUp(req.body.email, req.body.username, req.body.password, res)
    }
})

app.get('/signup',(req,res) => {
    res.sendFile('views/signup.html', {root: __dirname })
})

app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
})

app.post('/login',(req,res) => {
    dbi.validateUser(req.body.username, req.body.password).then(
        function(data) {
            if(data){
                req.session.userId=req.body.username;
                dbi.getUser(req.session.userId).then(function(findExisting){
                    res.render(__dirname + "\\views\\mainapplication", {
                        userinformation:{username: findExisting["username"], 
                        friends: findExisting["friends"], 
                        servers: findExisting["servers"],
                        invites: findExisting["invites"]}
                    })
    	        })
            }else if(data == "AccountInactive"){
                res.sendFile('views/verifyemail.html', {root: __dirname })
            }else{
                res.sendFile('views/loginfailed.html', {root: __dirname })
            }
        }
    )
})

app.get('/', function(req, res){
    if (req.session.userId != undefined || req.session.userId != null) {
        dbi.getUser(req.session.userId).then(function(findExisting){
            res.render(__dirname + "\\views\\mainapplication", {
                userinformation:{username: findExisting["username"], 
                friends: findExisting["friends"], 
                servers: findExisting["servers"],
                invites: findExisting["invites"]}
            })
        })
    } else {
        res.sendFile('views/login.html', {root: __dirname })
    }
})
  
ssrv.runSockets(app)

module.exports = app;