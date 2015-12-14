"use strict";
var __moduleName = (void 0);
var $__0 = Object.freeze(Object.defineProperties(["It's ", ", I'm ", ""], {raw: {value: Object.freeze(["It's ", ", I'm ", ""])}}));
var str1 = 'ohai';
var str2 = str1 + ' yall';
console.log(str2);
str2 = (str1 + " yall");
console.log(str2);
str2 = ("\n\n    " + str1 + "\n\n      yall\n");
console.log(str2);
str2 = ("" + str1.toUpperCase());
console.log(str2);
var x = 1;
var y = 2;
var eq = (x + " + " + y + " = " + (x + y));
console.log(eq);
var msg = ("It's " + new Date().getHours() + ", I'm sleepy");
console.log(msg);
function doSomeParsing(strings) {
  for (var values = [],
      $__1 = 1; $__1 < arguments.length; $__1++)
    $traceurRuntime.setProperty(values, $__1 - 1, arguments[$traceurRuntime.toProperty($__1)]);
  console.log(strings, values);
  $traceurRuntime.setProperty(values, 1, (values[$traceurRuntime.toProperty(0)] <= 20) ? 'awake' : 'sleepy');
  return (strings[$traceurRuntime.toProperty(0)] + " " + values[$traceurRuntime.toProperty(0)] + " " + strings[$traceurRuntime.toProperty(1)] + " " + values[$traceurRuntime.toProperty(1)] + " ");
}
var msg2 = doSomeParsing($__0, new Date().getHours(), "");
console.log(msg2);
