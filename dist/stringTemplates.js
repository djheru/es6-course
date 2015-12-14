var str1 = 'ohai';
var str2 = str1 + ' yall';
console.log(str2);
//string template syntax
str2 = `${ str1 } yall`;
console.log(str2);
//it respect whitespace
str2 = `

    ${ str1 }

      yall
`;
console.log(str2);
//it can be expression
str2 = `${ str1.toUpperCase() }`;
console.log(str2);
//yes expression
var x = 1;
var y = 2;
var eq = `${ x } + ${ y } = ${ x + y }`;
console.log(eq);

//tagging expression
var msg = `It's ${ new Date().getHours() }, I'm sleepy`;
console.log(msg);
function doSomeParsing(strings, ...values) {
  console.log(strings, values);
  values[1] = values[0] <= 20 ? 'awake' : 'sleepy';
  return `${ strings[0] } ${ values[0] } ${ strings[1] } ${ values[1] } `;
}
var msg2 = doSomeParsing`It's ${ new Date().getHours() }, I'm ${ "" }`;
console.log(msg2);