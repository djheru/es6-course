"use strict";

function greet(greeting, name) {
  console.log(greeting + ', ' + name);
}
greet();// undefined undefined

function greet2(greeting, name = 'dude') {
  console.log(greeting + ', ' + name);
}
greet2();// undefined dude
greet2('ohai');
greet2('hey', 'holmes');
