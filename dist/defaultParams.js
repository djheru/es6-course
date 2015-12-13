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