"use strict";

function greet(greeting, name) {
  console.log(greeting + ', ' + name);
}
greet(); // undefined undefined

function greet2(greeting, name = 'dude') {
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
function fcn2(cb = function () {
  console.log('ohai you forgot callback');
}) {
  cb();
}
fcn2();

//more cleaner
function fcn3(cb = () => console.log('ohai this way cleaner')) {
  cb();
}
fcn3();

//crazy, man
let fcn4 = (cb = () => console.log('ohai wat ru doing?!?')) => cb();
fcn4();