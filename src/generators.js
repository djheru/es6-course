"use strict";

function* greet() {
  console.log(`You called 'next()'`);
  yield "hello";
}
let greeter = greet();
console.log(greeter);//just an empty object
let next = greeter.next();//logs the thing
console.log(next); //{ value: 'hello', done: false }
let done = greeter.next();
console.log(done);//{ value: undefined, done: true }

function* greet2() {
  console.log(`generators are lazy`);
  yield "how";
  console.log(`I'm not called until the second next()`);
  yield "are";
  console.log(`Now the third next()`);
  yield "you?";
  console.log(`called when done`);
}
var greeter2 = greet2();
console.log(greeter2.next().value);
console.log(greeter2.next().value);
console.log(greeter2.next().value);
console.log(greeter2.next().value);

greeter2 = greet2();
for (let word of greeter2) {
  console.log(word);
}

console.log('two way comms');
//passing data in next()
function* greet3() {
  var yieldParam1 = yield "How";
  var yieldParam2 = yield yieldParam1 + " are";
  yield yieldParam2 + " you?";
}
var greeter3 = greet3();
console.log(greeter3.next().value);//can't pass data in a newborn generator
console.log(greeter3.next('the heck').value);//are
console.log(greeter3.next('you fricken doing').value);//you
console.log(greeter3.next().value);//undefined


//good for infinite things
function * graph() {
  var x = 0;
  var y = 0;
  while(true) {
    var addNext = yield {x: x, y: y};
    var incrementer = (addNext === undefined) ? {x: 1, y: 2} : addNext;
    x += incrementer.x;
    y += incrementer.y;
  }
}
var grapher = graph();

console.log(grapher.next().value);
console.log(grapher.next({x: 1, y: 4}).value);
console.log(grapher.next({x: 1, y: 2}).value);
console.log(grapher.next().value);
console.log(grapher.next({x: -6, y: -9}).value);
console.log(grapher.next({x: 1, y: 4}).value);
console.log(grapher.next({x: 8, y: 4}).value);
console.log(grapher.next().value);
console.log(grapher.next({x: 1, y: 2}).value);
console.log(grapher.next().value);
