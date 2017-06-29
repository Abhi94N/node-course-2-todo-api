var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //can configure to use promises that are built in
//mongoose handles connection prior to scheduling any queries
mongoose.connect('mongodb://localhost:27017/TodoApp', {useMongoClient: true});

//create a new model
//param1: collection name
//param2: data and its property
var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,//validation error if not ,
    minlength: 1,
    trim: true//removes leading or trailing white space
  },
  completed: {
    type: Boolean,
    default: false //default value
  },
  completedAt: {
    type: Number,
    default: null
  }
});

//add a todo
//use model as a constructor
var newTodo = new Todo({
  text: 'something to do'//still works even though different type
});

//save with built in function that returns a promise
// newTodo.save().then((doc) => {
//   console.log(`Saved todo, ${doc}`)
// }, (e) => {
//   console.log(`Unable to save todo: ${e}`);
// });


//user model - email, password, todos associated with the Users
//email - require - trim -string - minlength of 1
var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  password: {
    type: String
  },
  todos: {
    type: Array
  }
});

var newUser = new User({
  email: 'abhilash.nair@protiviti.com'
});

newUser.save().then((doc) => {
  console.log(JSON.stringify(doc, undefined, 2));
}, (e) => {
  console.log(`Unable to create user, ${e}`);
})
