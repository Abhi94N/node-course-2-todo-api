const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
//user model - email, password, todos associated with the Users
//email - require - trim -string - minlength of 1

//defines a new schema to add methods onto user
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6,
  },
  tokens: [{//mongodb only
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

//Model methods
UserSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();//converts mongo variable to json Object

  //overwrote a method for schema in order to return relevent values
  return _.pick(userObject, ['_id', 'email']);
};


//instance methods
//arrow functions do not bind this so requires actual function
UserSchema.methods.generateAuthToken = function() {
  var user = this;//access doc
  var access = 'auth';//set access
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();//create hash

  //push to array using ES6 syntax
  user.tokens.push({
    access,
    token
  });

  //save to mongodb
  //Promises return serverjs
  return user.save().then(() => {
    return token;//return taken to add to callback
  });//return promise so different file can retrieve promise value


};

//pass schema to model
var User = mongoose.model('User', UserSchema);

module.exports = {User};
