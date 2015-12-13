"use strict";

var fcnGreeting = function (msg, name) {
  return msg + ', ' + name;
};

/*var arrowGreeting = (msg, name) => {
  return msg + ', ' + name;
};*/

//above can be enshrinkend like this:
var arrowGreeting = (msg, name) =>  msg + ', ' + name;
console.log('fcn: ', fcnGreeting('ohai', 'phil'));
console.log('arrow: ', arrowGreeting('ohai', 'phil'));
