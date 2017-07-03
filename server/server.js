var express = require('express');
var bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');//destructuring require
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

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

app.listen(3000, () => {
  console.log('Started on port 3000');
});


module.exports = {
  app
};
