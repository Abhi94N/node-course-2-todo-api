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

  //create a new collection by calling it
  //param 1: json object
  //param 2: callback function for success or failure
  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if(err) {
  //     return console.log('Unable to insert todo', err);
  //   }
  //   //ops stores JSON Object passed in
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });
  //
  // //insert new doc into Users collection(name, age, location)
  // db.collection('Users').insertOne({
  //   name: 'Abhilash Nair',
  //   age: 23,
  //   location: '1428 Grovehurst Drive, Marietta, GA 30062'
  // }, (err, result) => {
  //   if(err) {
  //     return console.log('Unable to insert todo', err);
  //   }
  //   //ops stores JSON Object passed in
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  //   console.log(result.ops[0]._id);//access id
  //   console.log(result.ops[0]._id.getTimestamp());//get timestamp
  //
  // });


  db.close(); //closes the connection
});
