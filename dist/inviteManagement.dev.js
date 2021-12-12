"use strict";

var _require2;

var _require = require("mongodb"),
    MongoClient = _require.MongoClient,
    MongoRuntimeError = _require.MongoRuntimeError;

var dbi = (_require2 = require('./loginSignup'), loginSignup = _require2.loginSignup, _require2);

var utils = require('./utils');

var connection = dbi.client;

function addFriendInvite(Username, invite) {
  var database, userInformation;
  return regeneratorRuntime.async(function addFriendInvite$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          database = connection.db("users");
          userInformation = database.collection("userInformation");
          console.log();
          _context.next = 6;
          return regeneratorRuntime.awrap(userInformation.updateOne({
            username: Username
          }, {
            $addToSet: {
              invites: invite
            }
          }).then(function (result) {
            return console.log(result);
          }));

        case 6:
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
}

;

function deleteFriendInvite(Username, invite) {
  var database, userInformation;
  return regeneratorRuntime.async(function deleteFriendInvite$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          database = connection.db("users");
          userInformation = database.collection("userInformation");
          _context2.next = 5;
          return regeneratorRuntime.awrap(userInformation.updateOne({
            username: Username
          }, {
            $pull: {
              invites: invite
            }
          }).then(function (result) {
            return console.log(result);
          }));

        case 5:
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
}

;

function deleteFriend(Username, friend) {
  var database, userInformation;
  return regeneratorRuntime.async(function deleteFriend$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          database = connection.db("users");
          userInformation = database.collection("userInformation");
          _context3.next = 5;
          return regeneratorRuntime.awrap(userInformation.updateOne({
            username: friend
          }, {
            $pull: {
              friends: {
                username: Username
              }
            }
          }).then(function (result) {
            return console.log(result);
          }));

        case 5:
          console.log();
          _context3.next = 8;
          return regeneratorRuntime.awrap(userInformation.updateOne({
            username: Username
          }, {
            $pull: {
              friends: {
                username: friend
              }
            }
          }).then(function (result) {
            return console.log(result);
          }));

        case 8:
          console.log();
          _context3.next = 14;
          break;

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 11]]);
}

;

function addFriends(AcceptInformation) {
  var database, userInformation, friend;
  return regeneratorRuntime.async(function addFriends$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          database = connection.db("users");
          userInformation = database.collection("userInformation");
          friend = {
            username: AcceptInformation[1].requester,
            messages: []
          };
          _context4.next = 6;
          return regeneratorRuntime.awrap(userInformation.updateOne({
            username: AcceptInformation[0]
          }, {
            $addToSet: {
              friends: friend
            }
          }).then(function (result) {
            return console.log(result);
          }));

        case 6:
          friend = {
            username: AcceptInformation[0],
            messages: []
          };
          console.log();
          _context4.next = 10;
          return regeneratorRuntime.awrap(userInformation.updateOne({
            username: AcceptInformation[1].requester
          }, {
            $addToSet: {
              friends: friend
            }
          }).then(function (result) {
            return console.log(result);
          }));

        case 10:
          console.log();
          _context4.next = 16;
          break;

        case 13:
          _context4.prev = 13;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 13]]);
}

;
module.exports = {
  addFriendInvite: addFriendInvite,
  deleteFriendInvite: deleteFriendInvite,
  addFriends: addFriends,
  deleteFriend: deleteFriend
};