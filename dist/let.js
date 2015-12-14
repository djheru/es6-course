//let uses block scoping for variables, unlike var
var msg = 'ohai';
{
  var msg = 'lolgtfo';
}
console.log(msg); //lolgtfo

let msg2 = 'ohai';
{
  let msg2 = 'lolgtfo';
}
console.log(msg2); //great for if, for, forEach, etc

//block scoping in a for loop
var fs = [];
for (var i = 0; i < 10; i++) {
  fs.push(function () {
    console.log(i); //each iteration creates a function with a reference TO THE SAME INSTANCE OF 'i'
  });
}

fs.forEach(function (f) {
  f(); //by the time the function is invoked, the value of i is 10
});
//
var fs = [];
for (let i = 0; i < 10; i++) {
  fs.push(function () {
    console.log(i); //each iteration creates a function with a reference to a new 'i'
  });
}

fs.forEach(function (f) {
  f(); //each function instance in the array has reference to a different i
});

//Now your code is better
function varFunc(n) {
  var previous = 0;
  var current = 1;
  var i; //dafuq is this? IDK it not clear?
  var tmp; //hoisting tmp like a darn gmp

  for (i = 0; i < n; i += 1) {
    tmp = previous;
    previous = current;
    current = tmp + current;
  }
  return current;
}

function letFunc(n) {
  let previous = 0;
  let current = 1;
  for (let i = 0; i < n; i += 1) {
    let tmp = previous;
    previous = current;
    current = tmp + current;
  }
  return current;
}

console.log('varFunc(5)', varFunc(5));
console.log('letFunc(5)', letFunc(5));