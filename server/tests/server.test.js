const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const{Todo} = require('./../models/todo');
const{User} = require('./../models/user');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'},
   { _id: new ObjectID(),
    text: 'Second test todo'}];


//remove all todos
beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);//return response to chain callbacks
  }).then(() => done());
});



//organize tests
describe('POST /todos', () => {
  //test case gets created
  it('should create a new todo', (done) => {
    var text = 'Test todo text';
    request(app)
      .post('/todos')
      .send({text})//post to send
      .expect(200)//status expectations
      .expect((res) => {//test body
        expect(res.body.text).toBe(text);//expect body text to be above
      })
      .end((err, res) => {
        if(err) {
          return done(err);//prints out the error
        }

        //find with mongoose model to test database
        Todo.find({text}).then((todos) => {

          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));//any errors in the chain

      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)//test if status code set happens
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();//Don't forget done
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      }).end(done);

  });
});

describe('Get /todos/:id', () => {
  it('should return todo doc', (done) => {//async test
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)//generate proper id
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
        .end(done);
  });

  it('should return a 404 if todo not found ', (done) => {
    //make sure to get a 404 back
    var id = new ObjectID();
    request(app)
      .get(`/todos/${id.toHexString()}`).
      expect(404)
      .end(done);

  });

  it('should return a 404 for non-object ids', (done) => {
    //todos/123
    var id = new ObjectID();
    request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done);

  });
});


describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      }).end((err, res) => {
        if(err) {
          return done(err);//error is
        }
        //query databse using findById toNotExist
        //expect(test).toNotexist()
        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
      });

  });
  it('should return 404 if todo not found', (done) => {
      var id = new ObjectID();
      request(app)
        .delete(`/todos/123`)
        .expect(404)
        .end(done);
  });
  it('should return 404 if object id is invalid', (done) => {
    var id = new ObjectID();
    request(app)
      .delete(`/todos/123abc`)
      .expect(404)
      .end(done);
  });
});
