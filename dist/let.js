"use strict";
var __moduleName = (void 0);
var msg = 'ohai';
{
  var msg = 'lolgtfo';
}
console.log(msg);
var msg2 = 'ohai';
{
  try {
    throw undefined;
  } catch (msg2) {
    msg2 = 'lolgtfo';
  }
}
console.log(msg2);
var fs = [];
for (var i = 0; i < 10; i++) {
  fs.push(function() {
    console.log(i);
  });
}
fs.forEach(function(f) {
  f();
});
var fs = [];
{
  try {
    throw undefined;
  } catch ($i) {
    $i = 0;
    for (; $i < 10; $i++) {
      try {
        throw undefined;
      } catch (i) {
        i = $i;
        try {
          fs.push(function() {
            console.log(i);
          });
        } finally {
          $i = i;
        }
      }
    }
  }
}
fs.forEach(function(f) {
  f();
});
function varFunc(n) {
  var previous = 0;
  var current = 1;
  var i;
  var tmp;
  for (i = 0; i < n; i += 1) {
    tmp = previous;
    previous = current;
    current = tmp + current;
  }
  return current;
}
function letFunc(n) {
  var previous = 0;
  var current = 1;
  {
    try {
      throw undefined;
    } catch ($i) {
      $i = 0;
      for (; $i < n; $i += 1) {
        try {
          throw undefined;
        } catch (i) {
          i = $i;
          try {
            try {
              throw undefined;
            } catch (tmp) {
              tmp = previous;
              previous = current;
              current = tmp + current;
            }
          } finally {
            $i = i;
          }
        }
      }
    }
  }
  return current;
}
console.log('varFunc(5)', varFunc(5));
console.log('letFunc(5)', letFunc(5));
