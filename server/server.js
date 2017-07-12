require('./config/config');//environment configuration

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');//destructuring require
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

const port = process.env.PORT;

//middleware
app.use(bodyParser.json()); //can send json with app

//POST /todos creating a new todos
const asyncCreateTodo = async(req,res) => {
  var todo = new Todo({
    text: req.body.text,//where request comes from
    _creator: req.user._id
  });
  try {
    const doc = await todo.save();
    res.send(doc);
  } catch(e) {
    res.status(400).send(e);
  }

  //console.log(req.body);
}
app.post('/todos', authenticate, asyncCreateTodo);

//Get /todos
const asyncReadTodos = async(req, res) => {
  //return todos for user
  try {
    const todos = await Todo.find({_creator: req.user._id})
    res.send({todos});
  } catch(e) {
    res.status(400).send(e);
  }
  res.send({todos});//add array todos as an object so you can add more data
}
app.get('/todos', authenticate, asyncReadTodos);



//Get /todos/:id
const asyncGetTodobyId = async(req, res) => {
  //key -value: url param-value of url param-value
  var id = req.params.id;

  //validate Id using isValud
  if(!ObjectID.isValid(id)) {
    res.status(404).send();
  }
  //find by ID
    //sucess case - if todo exists send it back and if no todo send back 404 with empty body
    //error case - send back 400
  try {
    const todo = await Todo.findOne({_id: id, _creator: req.user._id });
    if(!todo) {
      return res.status(404).send();
    }
    res.send({todo});//to add custom status code
  } catch(e) {
    res.status(400).send()
  }
};
app.get('/todos/:id', authenticate, asyncGetTodobyId);



//delete DELETE .todos/:id
const asyncDeleteTodos = async(req, res) => {
  //get the id
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    res.status(404).send();
  }
  try {
    const todo = await Todo.findOneAndRemove({_id: id, _creator: req.user._id });
    if(!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  } catch(e) {
    res.status(404).send();
  }
}
app.delete('/todos/:id', authenticate, asyncDeleteTodos);


//PATCH: todos/:id or update
const asyncUpdateTodos = async(req, res) => {
  var id = req.params.id;
  //select params that users can update
  var body = _.pick(req.body, ['text', 'completed']) //takes an object and removes properties you want to pulloff
  //validate id
  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();//returns time stamp
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  try {
    const todo = //set body to updated body
    await Todo.findOneAndUpdate({_id: id, _creator:req.user._id }, {$set:
      body //pass the updated body
     }, {new: true})//option to retrieve new updated

     if(!todo) {
       return res.status(404).send();
     }
     res.send({todo: todo});//respond by sending it to send
   } catch(e) {
     return res.status(400).send();
   }
};
app.patch('/todos/:id', authenticate, asyncUpdateTodos);



//Sign up public route
//POST /users and use pick to limit what users change
//shut down server and wipe todo app database and restart the server
const asyncSignUpUser = async (req, res) => {
  //add the user model
  try {
    const user = new User(_.pick(req.body, ['email', 'password']));
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch(e) {
    res.status(400).send(e);
  }
};
app.post('/users', asyncSignUpUser);

//PRIVATE ROUTES - authenticate user
//require auth, find associated user, sends user back, pass middlware method before callback
app.get('/users/me', authenticate ,(req, res) => {
  res.send(req.user);//uses authenticate method passed in
});

//Login POST /user/login {email, password}
const asyncLoginUser = async(req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  try {
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch(e) {
    res.status(400).send();
  }
};
app.post('/users/login', asyncLoginUser);


//Delete DELETE /users/me/token
const asyncDeleteUser = async(req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch(e) {
    res.status(400).send();
  }
};
app.delete('/users/me/token', authenticate, asyncDeleteUser);



app.listen(port, () => {
  console.log(`Started on port ${port}`);
});


module.exports = {
  app
};
