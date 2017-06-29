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

  //delete many
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
  //   console.log(result); //returns status and number of documents deleted
  //
  // });

  //delete one
  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
  //     console.log(result);
  // });


  //findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //     console.log(result);
  // });
  db.collection('Users').deleteMany({name: 'Abhilash Nair'}).then((result) => {
     console.log(result);
 });

  db.collection('Users').findOneAndDelete({_id: 123}).then((result) => {
     console.log(result);
 });




  //db.close(); //closes the connection
});
