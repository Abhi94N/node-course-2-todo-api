const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const{Todo} = require('./../models/todo');
const{User} = require('./../models/user');

//remove all todos
beforeEach((done) => {
  Todo.remove({}).then(() => done());
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
        Todo.find().then((todos) => {
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
          expect(todos.length).toBe(0);
          done();//Don't forget done
        }).catch((e) => done(e));
      });
  });
});
