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

//creating a new todos
app.post('/todos', (req,res) => {
  var todo = new Todo({
    text: req.body.text//where request comes from
  });

  todo.save().then((doc) => {
    res.send(doc);//send back doc info
  }, (e) => {
    res.status(400).send(e);
  });
  //console.log(req.body);
});

//Get- read todos
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});//add array todos to object so you can add more code
  }, (e) => {
    res.status(400).send(e);
  });
});

//Get request/todos/id
app.get('/todos/:id', (req, res) => {
  //key -value: url param-value of url param-value
  var id = req.params.id;

  //validate Id using isValud
  if(!ObjectID.isValid(id)) {
    res.status(404).send();
  }
  //find by ID
    //sucess case - if todo exists send it back and if no todo send back 404 with empty body
    //error case - send back 400
  Todo.findById(id).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    res.send({todo});//to ad custom status code

  }).catch((e) => res.status(400).send());

});

//delete a todo
app.delete('/todos/:id', (req, res) => {
  //get the id
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => res.status(404).send());
});


//patch or update
app.patch('/todos/:id', (req, res) => {
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

  //set body to updated body
  Todo.findByIdAndUpdate(id, {$set:
    body //pass the updated body
   }, {new: true})//option to retrieve new updated
  .then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }

    res.send({todo: todo});//respond by sending it to send
  }).catch((e) => {
    res.status(400).send();
  })
});



//Sign up public route
//POST /users and use pick to limit what users change
//shut down server and wipe todo app database and restart the server
app.post('/users', (req, res) => {
  //add the user model
  var user = new User(_.pick(req.body, ['email', 'password']));

  user.save().then(() => {//can empty user object and is not required
    return user.generateAuthToken();

  }).then((token) => {
    //x-auth -create custom header to store token so user can authenticate themselves
    res.header('x-auth', token).send(user);
  })
  .catch((e) => {
    res.status(400).send(e);
  });
});

//PRIVATE ROUTES - authenticate user
//require auth, find associated user, sends user back, pass middlware method before callback
app.get('/users/me', authenticate ,(req, res) => {
  res.send(req.user);//uses authenticate method passed in
});

//Login POST /user/login {email, password}
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    //generate user token
    return user.generateAuthToken().then((token) => {//keep the chain alive you return
      res.header('x-auth', token).send(user);//send back user and get the current token to access app
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});


module.exports = {
  app
};
