const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');//get the mongoose connection
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '59569b90dca23a25c8b6e47711';//id for querying
//
// if(!ObjectID.isValid(id)) {
//   console.log('ID not valid');
// }
//
// //find query - returns array of json obects
// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// //gets the first found document
// Todo.findOne({
//   completed: false
// }).then((todo) => {
//   console.log('Todo', todo);
// });
//
// Todo.findById(id).then((todo) => {
//   if(!todo) {
//     return console.log('Id not valid');
//   }
//   console.log('Todo by Id ', todo);
// }).catch((e) => {
//   console.log(e);
// });

var id = '595464ccb70126059424deae';
User.findById(id).then((user) => {
  if(!user) {
    return console.log('User not found');
  }
  console.log('User by Id', user);
}).catch((e) => console.log(e));


//check mongoose queries
