const app = require("../app");
const request = require("supertest");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const moment = require('moment')
const fs = require('fs')
// Create queue - Done
// Read queue unfinish - Done
// Edit queue on progress based on id finish - Done
// Edit queue on progress based on id cancel - Done
// Edit queue on progress based on id late - Done
// Read owner - Done
// Read service - Done
// Validasi create queue: not null except checkou - Done
// Validasi create queue: on progress (prohibited) - Done

let queueTest = ''
let queueTest2 = ''
const merchantsjson = JSON.parse(fs.readFileSync('./merchant.json'))
const customersjson = JSON.parse(fs.readFileSync('./customer.json'))
const servicesjson = JSON.parse(fs.readFileSync('./service.json'))
const queuejson = JSON.parse(fs.readFileSync('./queue.json'))
merchantsjson.forEach(el => {
  el.createdAt = new Date(),
    el.updatedAt = new Date()
})
customersjson.forEach(el => {
  el.createdAt = new Date(),
    el.updatedAt = new Date()
})
servicesjson.forEach(el => {
  el.createdAt = new Date(),
    el.updatedAt = new Date()
})
queuejson.forEach(el => {
  el.createdAt = new Date(),
    el.updatedAt = new Date()
})

beforeAll((done) => {
  queryInterface
    .bulkInsert("Merchants", merchantsjson)
    .then((result) => {
      return queryInterface.bulkInsert("Customers", customersjson)
    })
    .then((result) => {
      return queryInterface.bulkInsert("Services", servicesjson)
    })
    .then((result) => {
      return queryInterface.bulkInsert('Queues', queuejson)
    })
    .then((result) => {
      done()
    })
    .catch(err => {
      done(err)
    })
});



//Service
describe("Service Table", () => {
  // Read service (DISPLAY)
  describe("Read Service", () => {
    describe("Success Porcess", () => {
      test("should return an array of object from service with status code (200)", (done) => {
        request(app)
          .get("/service/1")
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).toBe(200);
            expect.any(Array);
            return done();
          });
      });
    });
  });
});

//Merchant
describe("Merchant Table", () => {
  // Read Merchant (DISPLAY)
  describe("Read Merchant", () => {
    describe("Success Porcess", () => {
      test("should return an array of object from merchants with status code (200)", (done) => {
        request(app)
          .get("/merchant")
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).toBe(200);
            expect.any(Array);
            return done();
          });
      });
    });
  });
});

//Queue
describe("Queue Table", () => {
  //Read Queue
  describe("read queues", () => {
    describe("success read queue by service ", () => {
      test("should return data queue of object and status 200", (done) => {
        request(app)
          .get("/queue/service/1")
          .end((err, res) => {
            if (err) done(err);
            queueTest = JSON.parse(res.text)[0]
            queueTest2 = JSON.parse(res.text)[1]
            expect(res.status).toBe(200);
            expect.any(Array);
            return done();
          });
      });
    });
    describe("success read queue by queueId", () => {
      test("should return data queue of object and status 200", (done) => {
        request(app)
          .get("/queue/1")
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).toBe(200);
            expect.any(Array);
            return done();
          });
      });
    });
    describe("success read queue by queueId", () => {
      test("should return data queue of object and status 200", (done) => {
        request(app)
          .get("/queue/unfinishedCust/1")
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).toBe(200);
            expect.any(Array);
            return done();
          });
      });
    });
  });


  // VERIFY QUEUE

  describe('verify queue', () => {
    describe('success verify queue', () => {
      test('should return payload', () => {
        request(app)
          .post('/verify')
          .send({ token: queueTest.token })
          .end((err, res) => {
            if (err) done(err)
            expect(res.status).toBe(200)
            delete queueTest.token
            delete res.body.iat
            expect.any(Array);
          })
      })

    })

    describe('error verify', () => {
      test('should return status 500', () => {
        request(app)
          .post('/verify')
          .send({ token: 'dbavfadshkfbadkvfa' })
          .end((err, res) => {
            if (err) done(err)
            expect(res.status).toBe(500)
            expect(res.body).toHaveProperty('name', 'JsonWebTokenError')
            expect(res.body).toHaveProperty('message', 'jwt malformed')
          })
      })

      test('should return status 500', () => {
        request(app)
          .post('/verify')
          .send({ token: `${queueTest.token}sahjdshjdj` })
          .end((err, res) => {
            if (err) done(err)
            expect(res.status).toBe(500)
            expect(res.body).toHaveProperty('name', 'JsonWebTokenError')
            expect(res.body).toHaveProperty('message', 'invalid signature')
          })
      })

      test('should return status 403', () => {
        request(app)
          .post('/verify')
          .send({ token: `${queueTest2.token}` })
          .end((err, res) => {
            if (err) done(err)
            expect(res.status).toBe(403)
            expect(res.body).toHaveProperty('name', 'Forbidden')
            expect(res.body).toHaveProperty('errors', expect.any(Array))
          })
      })
    })

  })

  //Edit Queue
  describe("edit queue", () => {
    const change = {
      CustomerId: 1,
      ServiceId: 1,
      status: "finish",
      book_date: "2020-05-29T02:07:51.682Z",
    };
    describe('success edit queue status to "finish"', () => {
      test("should return status 200 and queue data", (done) => {
        request(app)
          .patch(`/queue/1`)
          .send(change)
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("status", change.status);
            return done();
          });
      });
    });
    describe('success edit queue status to "cancel"', () => {
      const changeToCancel = { ...change };
      changeToCancel.status = "cancel";
      test("should return status 200 and queue data", (done) => {
        request(app)
          .patch(`/queue/1`)
          .send(changeToCancel)
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("status", changeToCancel.status);
            return done();
          });
      });
    });
    describe('success edit queue status to "late"', () => {
      const changeToLate = { ...change };
      changeToLate.status = "late";
      test("should return status 200 and queue data", (done) => {
        request(app)
          .patch(`/queue/1`)
          .send(changeToLate)
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("status", changeToLate.status);
            return done();
          });
      });
    });

  });

  //CREATE QUEUE

  describe("create queue", () => {
    describe("success create queue", () => {
      test("this should return with id and data of queue", (done) => {
        const inputQueue = {
          CustomerId: 8,
          ServiceId: 1,
          status: "Pending",
          book_date: "2020-05-29T02:07:51.682Z",
        };
        request(app)
          .post("/queue")
          .send(inputQueue)
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("id", expect.any(Number));
            expect(res.body).toHaveProperty(
              "CustomerId",
              inputQueue.CustomerId
            );
            expect(res.body).toHaveProperty(
              "ServiceId",
              inputQueue.ServiceId
            );
            expect(res.body).toHaveProperty("book_date", expect.any(String));
            return done();
          });
      });
    });
    describe("error process", () => {
      test("this should return error status (400) of missing customer id", (done) => {
        request(app)
          .post("/queue")
          .send({
            CustomerId: null,
            ServiceId: 1,
            status: "Pending",
            book_date: "2020-05-29T02:07:51.682Z",
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("message", "Bad Request");
            return done();
          });
      });
      test("this should return error status (400) of missing service id", (done) => {
        request(app)
          .post("/queue")
          .send({
            CustomerId: 8,
            ServiceId: null,
            status: "Pending",
            book_date: "2020-05-29T02:07:51.682Z",
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("message", "Bad Request");
            return done();
          });
      });
      test("this should return error status (400) of missing status", (done) => {
        request(app)
          .post("/queue")
          .send({
            CustomerId: 2,
            ServiceId: 1,
            status: null,
            book_date: "2020-05-29T02:07:51.682Z",
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("message", "Bad Request");
            return done();
          });
      });
      describe("error validation unfinish", () => {

        test("this should return error with status 400 not finish queue", (done) => {
          request(app)
            .post("/queue")
            .send({
              CustomerId: 2,
              ServiceId: 3,
              status: "Pending",
              book_date: new Date(),
            })
            .end((err, res) => {
              if (err) done(err);
              expect(res.status).toBe(400);
              expect(res.body).toHaveProperty("errors", expect.any(Array));
              return done();
            });
        });
      });
    });
  });

});


// CUSTOMER TABLE
describe('Customer Table', () => {
  // CREATE USER
  describe('Register User', () => {
    describe('success register ', () => {
      test('should return status 201 success create user', (done) => {
        let data = {
          police_number: 'F 1111 COY',
          password: '123456'
        }
        request(app)
          .post('/register')
          .send(data)
          .end((err, res) => {
            if (err) {
              return done(err)
            } else {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('police_number', expect.any(String))
              expect(res.status).toBe(201)
              return done()
            }
          })
      })

    })

    describe('error process', () => {
      test('should be return error status (400) of missing password', (done) => {
        let withOutPassword = {
          police_number: 'F 1111 NIH'
        }
        request(app)
          .post('/register')
          .send(withOutPassword)
          .end((err, res) => {
            if (err) {
              return done(err)
            } else {
              expect(res.body).toHaveProperty('message', 'Bad Request')
              return done()
            }
          })
      })
    })

  })

  describe('Login User', () => {
    describe('success login user', () => {
      test('should return status 200 success login user', (done) => {
        const data = {
          police_number: 'F 1111 COY',
          password: '123456'
        }
        request(app)
          .post('/login')
          .send(data)
          .end((err, res) => {
            if (err) done(err)
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('id', expect.any(Number))
            return done()
          })
      })
    })

    describe('error login user', () => {
      test('should return status 400 error login user wrong password', (done) => {
        const data = {
          police_number: 'F 1111 COY',
          password: '3934834823'
        }
        request(app)
          .post('/login')
          .send(data)
          .end((err, res) => {
            if (err) done(err)
            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty('message', 'Bad Request')
            expect(res.body).toHaveProperty('errors', expect.any(Array))
            return done()
          })
      })

    })


  })

})
