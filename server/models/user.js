var mongoose = require('mongoose');
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

module.exports = {User};
