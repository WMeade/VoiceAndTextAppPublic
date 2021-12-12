"use strict";

var nodemailer = require("nodemailer");

var _require = require("mongodb"),
    MongoClient = _require.MongoClient,
    MongoRuntimeError = _require.MongoRuntimeError;

var client = new MongoClient("mongodb+srv://wmeade:TechnoLmao231624@voiceappproject.ufffs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
  useUnifiedTopology: true
});

function verifyEmail(Email, Username, code, res) {
  var user, transport;
  return regeneratorRuntime.async(function verifyEmail$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          user = "voicechatappyear4@gmail.com";
          transport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
              user: user,
              pass: "Blackknight231624"
            }
          });
          transport.sendMail({
            from: user,
            to: Email,
            subject: "Please verify your email",
            html: "<h1>Email Confirmation</h1>\n        <h2>Hello ".concat(Username, "</h2>\n        <p>Thank you for joining. Please confirm your email by clicking on the following link</p> \n        <a href=http://localhost:4000/confirm/").concat(code, "> Click here</a>")
          })["catch"](function (err) {
            return console.log(err);
          });
          res.sendFile('views/verifyemail.html', {
            root: __dirname
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}

function confirmUser(req, res) {
  var database, userInformation, findExisting;
  return regeneratorRuntime.async(function confirmUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(client.connect());

        case 3:
          database = client.db("users");
          userInformation = database.collection("userInformation");
          _context2.next = 7;
          return regeneratorRuntime.awrap(userInformation.findOne({
            confirmationCode: req.params.confirmationCode
          }));

        case 7:
          findExisting = _context2.sent;

          if (!(findExisting == null)) {
            _context2.next = 12;
            break;
          }

          res.sendFile('views/confirmemailfailed.html', {
            root: __dirname
          });
          _context2.next = 15;
          break;

        case 12:
          _context2.next = 14;
          return regeneratorRuntime.awrap(userInformation.updateOne({
            confirmationCode: req.params.confirmationCode
          }, {
            $set: {
              confirmationCode: "",
              accountActive: true,
              creation_date: null
            }
          }));

        case 14:
          res.sendFile('views/confirmemailsuccess.html', {
            root: __dirname
          });

        case 15:
          _context2.next = 20;
          break;

        case 17:
          _context2.prev = 17;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);

        case 20:
          _context2.prev = 20;
          _context2.next = 23;
          return regeneratorRuntime.awrap(client.close());

        case 23:
          return _context2.finish(20);

        case 24:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 17, 20, 24]]);
}

module.exports = {
  verifyEmail: verifyEmail,
  confirmUser: confirmUser
};