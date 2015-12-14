"use strict";
var __moduleName = (void 0);
"use strict";
require('traceur/bin/traceur-runtime');
var fcnGreeting = function(msg, name) {
  return msg + ', ' + name;
};
var arrowGreeting = (function(msg, name) {
  return msg + ', ' + name;
});
console.log('fcn: ', fcnGreeting('ohai', 'phil'));
console.log('arrow: ', arrowGreeting('ohai', 'phil'));
