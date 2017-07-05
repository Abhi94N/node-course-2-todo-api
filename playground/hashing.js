//sha 256
const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id: 10
}

//takes object and creates hash and returns token value
var token = jwt.sign(data, '123abc');//data and somesecret
console.log(token);


var decoded = jwt.verify(token, '123abc');//confirm data has not been changed
console.log('decoded', decoded);




//confirms whether data was manipulated or not
//jwt.verify
// var message = 'I am user number 3';
// var hash = SHA256(message).toString();
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 3
// };
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
//
// //changing data and hash
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString()
//
// //SALT for unique hash
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// //data was not manipulated
// if(resultHash === token.hash) {
//   console.log('Data was not changed');
//   console.log(`\n Token Hash: ${token.hash}`);
//   console.log(`\n Result Hash: ${resultHash}`);
// } else {
//   console.log('Data was changed. Do not trust! ');
//   console.log(`\n Token Hash: ${token.hash}`);
//   console.log(`\n Result Hash: ${resultHash}`);
// }
