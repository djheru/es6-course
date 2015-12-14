"use strict";
var __moduleName = (void 0);
"use strict";
function greet(greeting, name) {
  console.log(greeting + ', ' + name);
}
greet();
function greet2(greeting) {
  var name = arguments[$traceurRuntime.toProperty(1)] !== (void 0) ? arguments[$traceurRuntime.toProperty(1)] : 'dude';
  console.log(greeting + ', ' + name);
}
greet2();
greet2('ohai');
greet2('hey', 'holmes');
function fcn1(cb) {
  cb();
}
function fcn2() {
  var cb = arguments[$traceurRuntime.toProperty(0)] !== (void 0) ? arguments[$traceurRuntime.toProperty(0)] : function() {
    console.log('ohai you forgot callback');
  };
  cb();
}
fcn2();
function fcn3() {
  var cb = arguments[$traceurRuntime.toProperty(0)] !== (void 0) ? arguments[$traceurRuntime.toProperty(0)] : (function() {
    return console.log('ohai this way cleaner');
  });
  cb();
}
fcn3();
var fcn4 = (function() {
  var cb = arguments[$traceurRuntime.toProperty(0)] !== (void 0) ? arguments[$traceurRuntime.toProperty(0)] : (function() {
    return console.log('ohai wat ru doing?!?');
  });
  return cb();
});
fcn4();
