// Variables
var now = new Date();
var month = now.getMonth() + 1;
var year = now.getFullYear();
var day = now.getDate();
var numOfWeeks = 4;
var activeWeek = 1;
var numOfDays = daysInMonth(month, year);
var numOfElements = 0;
var view = "Month"

var firstDay;
var lastDay;
var numOfDaysInPM;
var numOfDays;
var pmDays;

var calInfo = {
  month: 1,
  year: 2018,
  day: 15,
  numOfWeeks: 4,
  activeWeek: 1,
  numOfDays: 30,
  numOfElements: 0
};

var days = [];

var monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

//functions

function dayOfWeek(month, year, day) {
  return new Date(year, month, day).getDay();
}

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

function decrementMonth(cal) {
  cal.month = cal.month - 1;
  if (cal.month < 1) {
    cal.month = 12;
    cal.year = cal.year - 1;
  }
  return (myArray = [cal.month, cal.year]);
}

function incrementMonth(cal) {
  cal.month = cal.month + 1;
  if (cal.month > 12) {
    cal.month = 1;
    cal.year = cal.year + 1;
  }
  return (myArray = [cal.month, cal.year]);
}

function nextMonth() {
  var nm = new Array();
  nm = incrementMonth(calInfo);
  month = nm[0];
  year = nm[1];
  clear();
}

function previousMonth() {
  var pm = new Array();
  pm = decrementMonth(calInfo);
  month = pm[0];
  year = pm[1];
  clear();
}

function clear() {
  updateCalInfo();
  for (i = 0; i < days.length; i++) {
    var elem = document.getElementById(i);
    elem.remove();
  }
  days = [];
  document.getElementById("month-name").innerHTML =
    monthNames[month - 1] + " " + year;
    view =  document.getElementById("view").value;
  fillDays();
}

function updateCalInfo() {
  calInfo = {
    month: month,
    year: year,
    day: day,
    numOfWeeks: numOfWeeks,
    activeWeek: activeWeek,
    numOfDays: numOfDays,
    numOfElements: numOfElements
  };
}


function createElements() {
  for (i = 0; i < days.length; i++) {
    var day = document.createElement("div");
    var text = document.createTextNode(days[i].day.toString());
    day.classList.add("day-div", days[i].className);
    day.id = i;
    day.appendChild(text);
    document.getElementById("day-container").appendChild(day);
  }
  for (i = 0; i < days.length; i++) {
    createEvents(
      days[i].month,
      days[i].day,
      days[i].year,
      days[i].className,
      i
    );
  }
}

function createEvents(m, d, y, c, i) {
  $.ajax({
    url: "../JSON/events.json",
    dataType: "json",
    type: "get",
    cache: false,
    success: function(data) {
      $(data.events).each(function(index, value) {
        console.log(value.des);
        if(value.endYear >= y){
        if (value.startYear < value.endYear) {
          if (
            value.endYear > y &&
            y == value.startYear &&
            value.startMonth >= m
          ) {
            if (
              m == value.startMonth &&
              y == value.startYear &&
              d >= value.startDay
            ) {
              event(value.des, i, value.color);
            }
          } else if (m > value.startMonth && y == value.startYear) {
            event(value.des, i, value.color);
          } else if (value.endYear > y && y > value.startYear) {
            event(value.des, i, value.color);
          } else if (value.endYear == y && m < value.endMonth) {
            event(value.des, i, value.color);
          } else if (
            value.endYear == y &&
            value.endMonth == m &&
            d <= value.endDay &&
            c != "NextMonth"
          ) {
            event(value.des, i, value.color);
          }
        } else if (
          value.startMonth == value.endMonth &&
          value.startMonth == m &&
          c == "currentMonth"
        ) {
          if (value.startYear == value.endYear) {
            if (value.startDay <= d && value.endDay >= d) {
              event(value.des, i, value.color);
            }
          }
        } else if (value.startMonth < value.endMonth) {
          if (m == value.startMonth && value.startDay <= d) {
            event(value.des, i, value.color);
          }
          if (m > value.startMonth && m < value.endMonth) {
            event(value.des, i, value.color);
          }
          if (value.endMonth == m && value.endDay >= d && c != "NextMonth") {
            if (m > value.startMonth && value.endMonth >= m) {
              event(value.des, i, value.color);
            }
            if (
              value.startMonth <= m &&
              value.endMonth >= m &&
              value.startDay <= d
            ) {
              event(value.des, i, value.color);
            }
          }
        }
      }
      });
    }
  });
}

function event(des, i, color) {
  var event = document.createElement("div");
  var text = document.createTextNode(des);
  event.classList.add("event-" + color);
  event.appendChild(text);
  document.getElementById(i).appendChild(event);
}

//console.log(days[1].name);

function fillDays() {
  var myArray = new Array();
  myArray = decrementMonth(calInfo);

  numOfDays = daysInMonth(month, year);
  firstDay = dayOfWeek(month - 1, year, 1);
  lastDay = dayOfWeek(month - 1, year, numOfDays);
  numOfDaysInPM = daysInMonth(myArray[0], myArray[1]);

  pmDays = 0;
  for (i = 1; i <= firstDay; i++) {
    pmDays++;
    days.push({
      location: i,
      day: numOfDaysInPM - firstDay + i,
      month: myArray[0],
      year: myArray[1],
      className: "previousMonth"
    });
  }

  for (i = 1; i <= numOfDays; i++) {
    days.push({
      location: i + firstDay,
      day: i,
      month: month,
      year: year,
      className: "currentMonth"
    });
  }

  var myArray = incrementMonth(calInfo);
  console.log("last Day: " + lastDay);
  for (i = 1; i <= 6 - lastDay; i++) {
    days.push({
      location: i + firstDay + numOfDays,
      day: i,
      month: myArray[0],
      year: myArray[1],
      className: "NextMonth"
    });
  }

  console.log("Beg");
  console.log(days);
  console.log("end");

  updateCalInfo();
  createElements();
}

//start
updateCalInfo();
document.getElementById("month-name").innerHTML =
  monthNames[month - 1] + " " + year;
fillDays();
console.log(calInfo.month);
console.log(days[0].year);
