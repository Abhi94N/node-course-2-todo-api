const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

//static methods for model instances
UserSchema.statics.findByToken = function (token) {
  var User = this;//assigned to model schema
  var decoded;
  try {
    decoded = jwt.verify(token, 'abc123');
  } catch(e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject('Failed to authenticate');
  }

  return User.findOne({//return for a promise
    '_id': decoded._id,
    'tokens.token': token,//fetch nested values
    'tokens.access': 'auth'
  });
};

//returns user if login credentials are correct
UserSchema.statics.findByCredentials = function(email, password) {
  var User = this;
  return User.findOne({email}).then((user) => {
    if(!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      //use bcrypt.compare password and user.password
      bcrypt.compare(password, user.password, (err, res) => {
        if(res) {//check if compare value is true
          resolve(user);//founduser
        } else {
          reject();
        }

      });
    });
  });
};

//Useful: http://mongoosejs.com/docs/middleware.html
UserSchema.pre('save', function(next) {
  //middleware always requires next to be called before it can move to the next piece of middleware
  var user = this;//instance method so fetches document


  if(user.isModified('password')) {
    //add to gen salt and hash
    //user.password
    bcrypt.genSalt(10,(err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        //store hash inside database
        user.password = hash;
        next();//call next whenever finished with middleware
      });
    });
    //set it to user.password = hash

  } else {
    next();//if user password has not been changed
  }


});//add

//pass schema to model
var User = mongoose.model('User', UserSchema);

module.exports = {User};
