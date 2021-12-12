"use strict";

var _require, _require2;

var cookieParser = require("cookie-parser");

var sessions = require('express-session');

var MongoStore = require('connect-mongo');

var mongoose = require('mongoose');

var uuid = require('uuid');

var dbi = (_require = require('./loginSignup'), loginSignup = _require.loginSignup, _require);

var auth = require('./auth');

var express = require('express');

var app = express();
var oneDay = 1000 * 60 * 60 * 24;
var ssrv = (_require2 = require('./socketServer'), socketServer = _require2.socketServer, _require2);
mongoose.connect('mongodb+srv://wmeade:TechnoLmao231624@voiceappproject.ufffs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true
});
var conn = mongoose.connection;
conn.on('connected', function () {
  console.log('MongoDB connected');
});
dbi.deleteInactiveUsersandCookies();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express["static"](__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(sessions({
  secret: uuid.v4(),
  saveUninitialized: true,
  cookie: {
    maxAge: oneDay,
    secure: false,
    sameSite: 'strict'
  },
  resave: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://wmeade:TechnoLmao231624@voiceappproject.ufffs.mongodb.net/UserSessions?retryWrites=true&w=majority'
  })
}));
app.get("/confirm/:confirmationCode", function (req, res) {
  auth.confirmUser(req, res);
});
app.post("/accountVerification", function (req, res) {
  if (req.body.password != req.body.passwordConfirm) {
    res.sendFile('views/signuperrorpassword.html', {
      root: __dirname
    });
  } else {
    dbi.signUp(req.body.email, req.body.username, req.body.password, res);
  }
});
app.get('/signup', function (req, res) {
  res.sendFile('views/signup.html', {
    root: __dirname
  });
});
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/');
});
app.post('/login', function (req, res) {
  dbi.validateUser(req.body.username, req.body.password).then(function (data) {
    if (data) {
      req.session.userId = req.body.username;
      dbi.getUser(req.session.userId).then(function (findExisting) {
        res.render(__dirname + "\\views\\mainapplication", {
          userinformation: {
            username: findExisting["username"],
            friends: findExisting["friends"],
            servers: findExisting["servers"],
            invites: findExisting["invites"]
          }
        });
      });
    } else if (data == "AccountInactive") {
      res.sendFile('views/verifyemail.html', {
        root: __dirname
      });
    } else {
      res.sendFile('views/loginfailed.html', {
        root: __dirname
      });
    }
  });
});
app.get('/', function (req, res) {
  if (req.session.userId != undefined || req.session.userId != null) {
    dbi.getUser(req.session.userId).then(function (findExisting) {
      res.render(__dirname + "\\views\\mainapplication", {
        userinformation: {
          username: findExisting["username"],
          friends: findExisting["friends"],
          servers: findExisting["servers"],
          invites: findExisting["invites"]
        }
      });
    });
  } else {
    res.sendFile('views/login.html', {
      root: __dirname
    });
  }
});
ssrv.runSockets(app);
module.exports = app;