"use strict";

var _require2;

var _require = require("mongodb"),
    MongoClient = _require.MongoClient,
    MongoRuntimeError = _require.MongoRuntimeError;

var dbi = (_require2 = require('./loginSignup'), loginSignup = _require2.loginSignup, _require2);

var utils = require('./utils');

var connection = dbi.client;

function addMessage(messageInformation) {
  var database, userInformation;
  return regeneratorRuntime.async(function addMessage$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          database = connection.db("users");
          userInformation = database.collection("userInformation");
          console.log();
          _context.next = 6;
          return regeneratorRuntime.awrap(userInformation.updateOne({
            username: messageInformation[0],
            "friends.username": messageInformation[1].username
          }, {
            $push: {
              "friends.$.messages": messageInformation[1]
            }
          }).then(function (result) {
            return console.log(result);
          }));

        case 6:
          console.log();
          _context.next = 9;
          return regeneratorRuntime.awrap(userInformation.updateOne({
            username: messageInformation[1].username,
            "friends.username": messageInformation[0]
          }, {
            $push: {
              "friends.$.messages": messageInformation[1]
            }
          }).then(function (result) {
            return console.log(result);
          }));

        case 9:
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
}

function updateMessages(updatedMessages) {
  var database, userInformation;
  return regeneratorRuntime.async(function updateMessages$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          database = connection.db("users");
          userInformation = database.collection("userInformation");
          console.log();
          _context2.next = 6;
          return regeneratorRuntime.awrap(userInformation.updateOne({
            username: updatedMessages[0]
          }, {
            $set: {
              "friends.$[i].messages": updatedMessages[1]
            }
          }, {
            arrayFilters: [{
              "i.username": updatedMessages[1][0].username
            }]
          }).then(function (result) {
            return console.log(result);
          }));

        case 6:
          console.log();
          _context2.next = 9;
          return regeneratorRuntime.awrap(userInformation.updateOne({
            username: updatedMessages[1][0].username
          }, {
            $set: {
              "friends.$[i].messages": updatedMessages[1]
            }
          }, {
            arrayFilters: [{
              "i.username": updatedMessages[0]
            }]
          }).then(function (result) {
            return console.log(result);
          }));

        case 9:
          _context2.next = 14;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          console.log();

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
}

function deleteMessage(messageInformation) {
  var database, userInformation;
  return regeneratorRuntime.async(function deleteMessage$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          database = connection.db("users");
          userInformation = database.collection("userInformation");
          console.log();
          _context3.next = 6;
          return regeneratorRuntime.awrap(userInformation.updateOne({
            username: messageInformation[0],
            "friends.username": messageInformation[1].username
          }, {
            $pull: {
              "friends.$.messages": messageInformation[1]
            }
          }).then(function (result) {
            return console.log(result);
          }));

        case 6:
          console.log();
          _context3.next = 9;
          return regeneratorRuntime.awrap(userInformation.updateOne({
            username: messageInformation[1].username,
            "friends.username": messageInformation[0]
          }, {
            $pull: {
              "friends.$.messages": messageInformation[1]
            }
          }).then(function (result) {
            return console.log(result);
          }));

        case 9:
          console.log();
          _context3.next = 15;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 12]]);
}

module.exports = {
  addMessage: addMessage,
  updateMessages: updateMessages,
  deleteMessage: deleteMessage
};