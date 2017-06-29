var express = require('express');
var bodyParser = require('body-parser');


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

app.listen(3000, () => {
  console.log('Started on port 3000');
});
