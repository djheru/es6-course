"use strict";

function greet(greeting, name) {
  console.log(greeting + ', ' + name);
}
greet(); // undefined undefined

function greet2(greeting) {
  var name = arguments.length <= 1 || arguments[1] === undefined ? 'dude' : arguments[1];

  console.log(greeting + ', ' + name);
}
greet2(); // undefined dude
greet2('ohai');
greet2('hey', 'holmes');

//param is callable with no default
function fcn1(cb) {
  cb();
}
//fcn1();//throw error omg "TypeError: cb is not a function"

//param has defalt
function fcn2() {
  var cb = arguments.length <= 0 || arguments[0] === undefined ? function () {
    console.log('ohai you forgot callback');
  } : arguments[0];

  cb();
}
fcn2();

//more cleaner
function fcn3() {
  var cb = arguments.length <= 0 || arguments[0] === undefined ? function () {
    return console.log('ohai this way cleaner');
  } : arguments[0];

  cb();
}
fcn3();

//crazy, man
var fcn4 = function fcn4() {
  var cb = arguments.length <= 0 || arguments[0] === undefined ? function () {
    return console.log('ohai wat ru doing?!?');
  } : arguments[0];
  return cb();
};
fcn4();