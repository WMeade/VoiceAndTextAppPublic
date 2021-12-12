


function sleep(ms) {
    return new Promise(
      resolve => setTimeout(resolve, ms)
    );
}

function subtractTimeFromDate(objDate, intHours) {
    var numberOfMlSeconds = objDate.getTime();
    var addMlSeconds = (intHours * 60) * 60 * 1000;
    var newDateObj = new Date(numberOfMlSeconds - addMlSeconds);
 
    return newDateObj;
}

const isToday = (someDate) => {
  const today = new Date()
  return someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
}

module.exports = {subtractTimeFromDate, sleep, isToday}