var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //can configure to use promises that are built in
//mongoose handles connection prior to scheduling any queries

mongoose.connect(process.env.MONGODB_URI, || 'mongodb://localhost:27017/TodoApp', {useMongoClient: true});

module.export = {mongoose};
