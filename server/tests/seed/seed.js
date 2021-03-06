const jwt = require('jsonwebtoken');
const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'abhilashnair1994@gmail.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  email: 'abahsf@gmail.com',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];





const todos = [{
  _id: new ObjectID(),
  text: 'First test todo', _creator: userOneId},
   { _id: new ObjectID(),
    text: 'Second test todo',
  completed: true,
completedAt: 333, _creator: userTwoId}];


const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);//return response to chain callbacks
  }).then(() => done());
};


const populateUsers = (done) => {
  User.remove({}).then(() => {
    //save runs the middleware to stored the has password
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    //wait till all promises are resolved
    return Promise.all([userOne, userTwo]);

  }).then(() => done());
};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
}
