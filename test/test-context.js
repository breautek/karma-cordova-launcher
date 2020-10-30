
let context = require.context('./spec', true, /\.spec\.js$/);
console.log('CONTEXT', context);
context.keys().forEach(context);
