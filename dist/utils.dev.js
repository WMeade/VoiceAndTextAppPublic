"use strict";

function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}

function subtractTimeFromDate(objDate, intHours) {
  var numberOfMlSeconds = objDate.getTime();
  var addMlSeconds = intHours * 60 * 60 * 1000;
  var newDateObj = new Date(numberOfMlSeconds - addMlSeconds);
  return newDateObj;
}

var isToday = function isToday(someDate) {
  var today = new Date();
  return someDate.getDate() == today.getDate() && someDate.getMonth() == today.getMonth() && someDate.getFullYear() == today.getFullYear();
};

module.exports = {
  subtractTimeFromDate: subtractTimeFromDate,
  sleep: sleep,
  isToday: isToday
};