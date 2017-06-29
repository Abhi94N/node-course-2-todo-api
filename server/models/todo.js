var mongoose = require('mongoose');
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

module.exports ={Todo}; //exporting a model
