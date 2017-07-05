var {User} = require('./../models/user');

//middlware function used to authenticate data
var authenticate = (req, res, next) => {
  var token = req.header('x-auth');//fetch set variable
  User.findByToken(token).then((user) => {
    if(!user) {
      return Promise.reject();//function will run error/catch case
    }

    req.user = user;//pass request vales
    req.token = token;
    next();//code for the function after fails to execute
  }).catch((e) => {
    res.status(401).send()//auth is required
  });
}

module.exports = {authenticate};
