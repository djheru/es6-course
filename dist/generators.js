"use strict";
var __moduleName = (void 0);
"use strict";
function greet() {
  return $traceurRuntime.generatorWrap(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          console.log("You called 'next()'");
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return "hello";
        case 2:
          if ($ctx.action === 'throw') {
            $ctx.action = 'next';
            throw $ctx.sent;
          }
          $ctx.state = -2;
          break;
        case -2:
          return $ctx;
        case -3:
          throw $ctx.storedException;
        default:
          throw 'traceur compiler bug: invalid state in state machine: ' + $ctx.state;
      }
  }, this);
}
var greeter = greet();
console.log(greeter);
var next = greeter.next();
console.log(next);
var done = greeter.next();
console.log(done);
function greet2() {
  return $traceurRuntime.generatorWrap(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          console.log("generators are lazy");
          $ctx.state = 14;
          break;
        case 14:
          $ctx.state = 2;
          return "how";
        case 2:
          if ($ctx.action === 'throw') {
            $ctx.action = 'next';
            throw $ctx.sent;
          }
          $ctx.state = 4;
          break;
        case 4:
          console.log("I'm not called until the second next()");
          $ctx.state = 16;
          break;
        case 16:
          $ctx.state = 6;
          return "are";
        case 6:
          if ($ctx.action === 'throw') {
            $ctx.action = 'next';
            throw $ctx.sent;
          }
          $ctx.state = 8;
          break;
        case 8:
          console.log("Now the third next()");
          $ctx.state = 18;
          break;
        case 18:
          $ctx.state = 10;
          return "you?";
        case 10:
          if ($ctx.action === 'throw') {
            $ctx.action = 'next';
            throw $ctx.sent;
          }
          $ctx.state = 12;
          break;
        case 12:
          console.log("called when done");
          $ctx.state = -2;
          break;
        case -2:
          return $ctx;
        case -3:
          throw $ctx.storedException;
        default:
          throw 'traceur compiler bug: invalid state in state machine: ' + $ctx.state;
      }
  }, this);
}
var greeter2 = greet2();
console.log(greeter2.next().value);
console.log(greeter2.next().value);
console.log(greeter2.next().value);
console.log(greeter2.next().value);
greeter2 = greet2();
for (var $__0 = greeter2[$traceurRuntime.toProperty(Symbol.iterator)](),
    $__1; !($__1 = $__0.next()).done; ) {
  try {
    throw undefined;
  } catch (word) {
    word = $__1.value;
    {
      console.log(word);
    }
  }
}
console.log('two way comms');
function greet3() {
  var yieldParam1,
      yieldParam2;
  return $traceurRuntime.generatorWrap(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          $ctx.state = 2;
          return "How";
        case 2:
          if ($ctx.action === 'throw') {
            $ctx.action = 'next';
            throw $ctx.sent;
          }
          $ctx.state = 4;
          break;
        case 4:
          yieldParam1 = $ctx.sent;
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 8;
          return yieldParam1 + " are";
        case 8:
          if ($ctx.action === 'throw') {
            $ctx.action = 'next';
            throw $ctx.sent;
          }
          $ctx.state = 10;
          break;
        case 10:
          yieldParam2 = $ctx.sent;
          $ctx.state = 12;
          break;
        case 12:
          $ctx.state = 14;
          return yieldParam2 + " you?";
        case 14:
          if ($ctx.action === 'throw') {
            $ctx.action = 'next';
            throw $ctx.sent;
          }
          $ctx.state = -2;
          break;
        case -2:
          return $ctx;
        case -3:
          throw $ctx.storedException;
        default:
          throw 'traceur compiler bug: invalid state in state machine: ' + $ctx.state;
      }
  }, this);
}
var greeter3 = greet3();
console.log(greeter3.next().value);
console.log(greeter3.next('the heck').value);
console.log(greeter3.next('you fricken doing').value);
console.log(greeter3.next().value);
function graph() {
  var addNext,
      incrementer,
      x,
      y;
  return $traceurRuntime.generatorWrap(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          x = 0;
          $ctx.state = 15;
          break;
        case 15:
          y = 0;
          $ctx.state = 17;
          break;
        case 17:
          if (true) {
            $ctx.state = 1;
            break;
          } else {
            $ctx.state = -2;
            break;
          }
        case 1:
          $ctx.state = 2;
          return {
            x: x,
            y: y
          };
        case 2:
          if ($ctx.action === 'throw') {
            $ctx.action = 'next';
            throw $ctx.sent;
          }
          $ctx.state = 4;
          break;
        case 4:
          addNext = $ctx.sent;
          $ctx.state = 6;
          break;
        case 6:
          incrementer = (addNext === undefined) ? {
            x: 1,
            y: 2
          } : addNext;
          $ctx.state = 8;
          break;
        case 8:
          x += incrementer.x;
          $ctx.state = 10;
          break;
        case 10:
          y += incrementer.y;
          $ctx.state = 17;
          break;
        case -2:
          return $ctx;
        case -3:
          throw $ctx.storedException;
        default:
          throw 'traceur compiler bug: invalid state in state machine: ' + $ctx.state;
      }
  }, this);
}
var grapher = graph();
console.log(grapher.next().value);
console.log(grapher.next({
  x: 1,
  y: 4
}).value);
console.log(grapher.next({
  x: 1,
  y: 2
}).value);
console.log(grapher.next().value);
console.log(grapher.next({
  x: -6,
  y: -9
}).value);
console.log(grapher.next({
  x: 1,
  y: 4
}).value);
console.log(grapher.next({
  x: 8,
  y: 4
}).value);
console.log(grapher.next().value);
console.log(grapher.next({
  x: 1,
  y: 2
}).value);
console.log(grapher.next().value);
