"use strict";

console.log(['foo', 'bar', 'baz']);
console.log(...['foo', 'bar', 'baz']);

//playing with array
let first = [1,2,3];
let onest = [1,2,3];
let second = [4,5,6];
first.push(second);
onest.push(...second);
console.log(first); // [ 1, 2, 3, [ 4, 5, 6 ] ]
console.log(onest); // [ 1, 2, 3, 4, 5, 6 ]

function addThree(a, b, c) {
  let result = a + b + c;
  console.log(result);
}
//good for spreading params out of an array
addThree(...second);
