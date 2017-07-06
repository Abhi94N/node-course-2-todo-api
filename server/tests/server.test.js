const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const{Todo} = require('./../models/todo');
const{User} = require('./../models/user');
const {todos, populateTodos,   users,
  populateUsers} = require('./seed/seed');
  const bcrypt = require('bcryptjs');


beforeEach(populateUsers);
beforeEach(populateTodos);//retrieved from populate from seed file


//organize tests
describe('POST /todos', () => {
  //test case gets created
  it('should create a new todo', (done) => {
    var text = 'Test todo text';
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      }).end(done);

  });
});

describe('Get /todos/:id', () => {
  it('should return todo doc', (done) => {//async test
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)//generate proper id
      .set('x-auth', users[0].tokens[0].token)
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
      .get(`/todos/${id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);

  });

  it('should return a 404 for non-object ids', (done) => {
    //todos/123
    var id = new ObjectID();
    request(app)
      .get(`/todos/123`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);

  });

  it('should not return a todo doc created by other user', (done) => {//async test
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)//generate proper id
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
        .end(done);
  });
});


describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
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
  it('should not remove a todo because tod does not belong to user ', (done) => {
    var hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if(err) {
          return done(err);//error is
        }
        //query databse using findById toNotExist
        //expect(test).toNotexist()
        Todo.findById(hexId).then((todo) => {
          expect(todo).toExist();
          done();
        }).catch((e) => done(e));
      });
  });
  it('should return 404 if todo not found', (done) => {
      var id = new ObjectID();
      request(app)
        .delete(`/todos/${id}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
  });
  it('should return 404 if object id is invalid', (done) => {

    request(app)
      .delete(`/todos/123abc`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

});


describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    var id = todos[0]._id.toHexString();
        //update text set completed to true
        //200 text is changed, completed is true, completedAt is a number
    var updatedText = {
        'text': "this is from code",
        'completed': true  }

    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .send(updatedText)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(updatedText.text)
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });
  it('should not update the todo because user not authorized', (done) => {
    var id = todos[0]._id.toHexString();
        //update text set completed to true
        //200 text is changed, completed is true, completedAt is a number
    var updatedText = {
        'text': "this is from code",
        'completed': true  }

    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .send(updatedText)
      .expect(404)
      .end(done);
  });
  it('should clear completedAt when todo is not completed', (done) => {
    //grab id
    var id = new ObjectID();
    //update text, set completed to false
    //200 text is changed and completed false, completedAt is null .toNotExist
    var id = todos[1]._id.toHexString();
    var updatedText =
      {    //update text, set completed to false 200 text is changed and completed false, completedAt is null .toNotExist
        'text': "this is from my other code",
        'completed': false
      }
    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .send(updatedText)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(updatedText.text)
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);

  });
});

describe('GET /users/me', () => {
  it('it should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);

  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({})//ran test
    })
    .end(done);

  });
});

describe('POST /users', () => {
  var email = 'example@example.com';
  var password = '123mnb';
  it('Should create a user', (done) => {
    request(app)
    .post('/users')
    .send({
      email,
      password
    })
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toExist();
      expect(res.body._id).toExist();
      expect(res.body.email).toBe(email);
    })//Custom end done
    .end((err) => {
      if(err) {
        return done(err);
      }
      User.findOne({email}).then((user) => {
        expect(user).toExist();
        expect(user.password).toNotBe(password);
        done();
      }).catch((e) => done(e));
    });

  });

  it('Should return validation error if request invalid', (done) => {
    request(app)
    .post('/users')
    .send({
      email: "asfsfdfdfa",
      password: '1'
    })
    .expect(400)
    .end(done);
  });

  it('should not create user if email in use', (done) => {
    request(app)
    .post('/users')
    .send({
      email: users[0].email,
      password: 'Admin123'
    })
    .expect(400)
    .end(done);
  });
});

describe('POST /users/login', () => {
  var testUser = {  email: users[1].email,
    password: users[1].password};
  it('should login user and return auth token', (done) => {
    request(app)
    .post('/users/login')
    .send(testUser)
    .expect(200)
    .expect((res) => {
      bcrypt.compare(res.body.password, testUser.password).then((res) => {
        expect(res).toBe(true);
      }, (err) => {
        return err;
      });

      expect(res.headers['x-auth']).toExist();
      expect(res.body.email).toBe(testUser.email);

    }).end((err, res) => {
      if(err) {
        return done(err);
      }

      User.findById(users[1]._id).then((user) => {
        expect(user.tokens[1]).toInclude({//second login token
          access: 'auth',
          token: res.headers['x-auth']
        });
        done();
      }).catch((e) => done(e));
    });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();


      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
         User.findById(users[1]._id).then((user) => {

           expect(user.tokens.length).toBe(1);//second token does not exist
           done();
         }).catch((e) => done(e));
      });

  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .end((err, res) => {
      if(err) {
        return done(err);
      }
      User.findById(users[0]._id).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((e) => done(e));
    })
  });
});
