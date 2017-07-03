const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');//get the mongoose connection
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//delete records

// Todo.remove({})
// Todo.remove({}).then((result) => {
//   console.log(result);
// });
//
// // //find one and remvoe returns
// Todo.findOneAndRemove({_id: "595abfa674b650249f11385a"}).then((docs) => {
//
// });

Todo.findByIdAndRemove('595abfa674b650249f11385a').then((todo) => {
  console.log(todo)
});
