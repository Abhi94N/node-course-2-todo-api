//const MongoClient = require('mongodb').MongoClient; //mongodb client that connects to mongoserver
const {MongoClient, ObjectID} = require('mongodb');//destructuring for require

// var obj = new ObjectID();//create objectID
// console.log(obj);

 //production base is amazon webservices url or heroku url
//order site/port/databaseconnection
//mongo will create ToDoApp database when values are enteredsn
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err) {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');

//findOneAndUpdate
  // db.collection('Todos').findOneAndUpdate({//filter
  //   _id: new ObjectID('59544da57a14db90cafba4ec')
  // }, {//update how
  //   $set: {//mongodb operators
  //     completed: true
  //   }
  // }, {//options
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5951712b0d746828485a9f56')
  }, {
    $set: {
      name: 'Abhilash Nair'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });





  //db.close(); //closes the connection
});
