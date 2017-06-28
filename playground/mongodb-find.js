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

  //finding json from mongo - pass json query
  //to Array converts json into array returns a promise for fetched data
  // db.collection('Todos').find({_id: new ObjectID('595158610f6b4e2f50198f21')}).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // });

  // db.collection('Todos').find().count().then((count) => {
  //   //counts all of todos
  //   console.log(`Todos count: ${count} `);
  //
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // });
  db.collection('Users').find({name: 'Abhilash Nair'}).toArray().then((docs) => {
      console.log('Users');
      console.log(JSON.stringify(docs, undefined, 2));
  });



  //db.close(); //closes the connection
});
