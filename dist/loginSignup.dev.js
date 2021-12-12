"use strict";

var _require = require("mongodb"),
    MongoClient = _require.MongoClient,
    MongoRuntimeError = _require.MongoRuntimeError;

var _require2 = require("mongoose"),
    now = _require2.now;

var client = new MongoClient("mongodb+srv://wmeade:TechnoLmao231624@voiceappproject.ufffs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
  useUnifiedTopology: true
});

var uuid = require('uuid');

var auth = require('./auth');

var utils = require('./utils');

var fs = require('fs');

client.connect();

function addUser(Email, Username, Password, res) {
  var database, userInformation, confirmationCode, findExisting;
  return regeneratorRuntime.async(function addUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          database = client.db("users");
          userInformation = database.collection("userInformation");
          confirmationCode = uuid.v4();
          _context.next = 6;
          return regeneratorRuntime.awrap(userInformation.findOne({
            confirmationCode: confirmationCode
          }).then(function (findExisting) {
            while (findExisting != null) {
              confirmationCode = uuid.v4();
              findExisting = userInformation.findOne({
                confirmationCode: confirmationCode
              });
            }

            ;
          }));

        case 6:
          findExisting = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(userInformation.insertOne({
            username: Username,
            password: Password,
            email: Email,
            servers: [],
            friends: [],
            invites: [],
            confirmationCode: confirmationCode,
            accountActive: false,
            creation_date: new Date()
          }));

        case 9:
          auth.verifyEmail(Email, Username, confirmationCode, res);
          _context.next = 15;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
}

;

function getUser(Username) {
  var database, userInformation, findExisting;
  return regeneratorRuntime.async(function getUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          database = client.db("users");
          userInformation = database.collection("userInformation");
          _context2.next = 5;
          return regeneratorRuntime.awrap(userInformation.findOne({
            username: Username
          }));

        case 5:
          findExisting = _context2.sent;

          if (!(findExisting == null)) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", null);

        case 10:
          return _context2.abrupt("return", findExisting);

        case 11:
          _context2.next = 16;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
}

;

function getUsers(Username) {
  var database, userInformation, findExisting;
  return regeneratorRuntime.async(function getUsers$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          database = client.db("users");
          userInformation = database.collection("userInformation");
          _context3.next = 5;
          return regeneratorRuntime.awrap(userInformation.find({
            username: new RegExp(Username, 'i')
          }).toArray());

        case 5:
          findExisting = _context3.sent;

          if (!(findExisting == null)) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", null);

        case 10:
          return _context3.abrupt("return", findExisting);

        case 11:
          _context3.next = 16;
          break;

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 13]]);
}

;

function validateUser(Username, Password) {
  var database, userInformation, findExisting;
  return regeneratorRuntime.async(function validateUser$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          database = client.db("users");
          userInformation = database.collection("userInformation");
          _context4.next = 5;
          return regeneratorRuntime.awrap(userInformation.findOne({
            username: Username,
            password: Password
          }));

        case 5:
          findExisting = _context4.sent;

          if (!(findExisting == null || Username == null || Password == null)) {
            _context4.next = 10;
            break;
          }

          return _context4.abrupt("return", false);

        case 10:
          if (!(findExisting["accountActive"] == false)) {
            _context4.next = 12;
            break;
          }

          return _context4.abrupt("return", "AccountInactive");

        case 12:
          return _context4.abrupt("return", true);

        case 13:
          _context4.next = 18;
          break;

        case 15:
          _context4.prev = 15;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);

        case 18:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 15]]);
}

;

function signUp(Email, Username, Password, res) {
  var database, userInformation, findExisting;
  return regeneratorRuntime.async(function signUp$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          database = client.db("users");
          userInformation = database.collection("userInformation");
          _context5.next = 5;
          return regeneratorRuntime.awrap(userInformation.findOne({
            $or: [{
              email: Email
            }, {
              username: Username
            }]
          }).then(function (findExisting) {
            if (findExisting != null) {
              if (Username == findExisting["username"] || Email == findExisting["email"]) {
                res.sendFile('views/signuperrorname.html', {
                  root: __dirname
                });
              }
            } else {
              if (Email == "" || Username == "" || Password == "") {
                res.sendFile('views/signuperrorname.html', {
                  root: __dirname
                });
              } else {
                addUser(Email, Username, Password, res);
              }
            }
          }));

        case 5:
          findExisting = _context5.sent;
          _context5.next = 11;
          break;

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 8]]);
}

function deleteInactiveUsersandCookies() {
  var databaseOne, userInformation, findExisting, content;
  return regeneratorRuntime.async(function deleteInactiveUsersandCookies$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          if (!true) {
            _context6.next = 25;
            break;
          }

          _context6.prev = 1;
          _context6.next = 4;
          return regeneratorRuntime.awrap(utils.sleep(1800000));

        case 4:
          databaseOne = client.db("users");
          userInformation = databaseOne.collection("userInformation");
          date = new Date();
          date = utils.subtractTimeFromDate(date, 1);
          dateTwo = new Date();
          dateTwo = utils.subtractTimeFromDate(dateTwo, 24);
          _context6.next = 12;
          return regeneratorRuntime.awrap(userInformation.deleteMany({
            creation_date: {
              $lte: date
            }
          }));

        case 12:
          findExisting = _context6.sent;
          console.log("\nDeletion time: " + date);
          process.stdout.write("Deleted users: ");
          console.log(findExisting);
          content = "\nDeletion time: ".concat(date, "\nDeleted users: ").concat(findExisting.deletedCount, "\n");
          fs.appendFileSync('./logs/deletionLog.txt', content);
          _context6.next = 23;
          break;

        case 20:
          _context6.prev = 20;
          _context6.t0 = _context6["catch"](1);
          console.error(_context6.t0);

        case 23:
          _context6.next = 0;
          break;

        case 25:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[1, 20]]);
}

module.exports = {
  addUser: addUser,
  getUser: getUser,
  validateUser: validateUser,
  signUp: signUp,
  deleteInactiveUsersandCookies: deleteInactiveUsersandCookies,
  getUsers: getUsers,
  client: client
};