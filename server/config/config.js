var env = process.env.NODE_ENV || 'development';//set it to development

if(env === 'development' || env === 'test') {
  var config = require('./config.json');
  var envConfig = config[env];//returns json

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];//loops over array for
  });
  
}

//do not add json configuration in public
// if(env === 'development') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
// } else if(env == 'test') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'//changes in test mode
// }
