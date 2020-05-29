const { app } = require("../app");
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

const testId = null;

const merchantsjson = JSON.parse(fs.readFileSync('./merchant.json'))
const customersjson = JSON.parse(fs.readFileSync('./customer.json'))
const servicesjson = JSON.parse(fs.readFileSync('./service.json'))
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

beforeAll((done) => {
  queryInterface
    .bulkInsert("Merchants", merchantsjson)
    .then((_) => {
      done();
    })
    .catch((err) => {
      done(err);
    });
  queryInterface
    .bulkInsert("Customers", customersjson)
    .then((_) => {
      done()
    })
    .catch(err => {
      done(err)
    })
  queryInterface
    .bulkInsert("Services", servicesjson)
    .then((_) => {
      done()
    })
    .catch(err => {
      done(err)
    })
});
afterAll((done) => {
  queryInterface
    .bulkDelete("Merchants", {})
    .then((_) => {
      done();
    })
    .catch((err) => {
      done(err);
    });
  queryInterface
    .bulkDelete("Customers", {})
    .then((_) => {
      done();
    })
    .catch((err) => {
      done(err);
    });
  queryInterface
    .bulkDelete("Services", {})
    .then((_) => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});


//Queue
describe("Queue Table", () => {
  // Create queue
  afterAll((done) => {
    queryInterface
      .bulkDelete("Queues", {})
      .then(() => done())
      .catch((err) => done(err));
  });
  describe("create queue", () => {
    describe("success create queue", () => {
      test("this should return with id and data of queue", (done) => {
        const inputQueue = {
          CustomerId: 1,
          ServiceId: 1,
          status: "Pending",
          book_date: "2020-05-29T02:07:51.682Z",
        };
        request(app)
          .post("/queue")
          .send(inputQueue)
          .end((err, res) => {
            if (err) done(err);
            //Ini buat find by id test selanjutnya
            testId = res.body.id;
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
            CustomerId: 1,
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
      test("this should return error status (400) of missing book date", (done) => {
        request(app)
          .post("/queue")
          .send({
            CustomerId: 1,
            ServiceId: 1,
            status: "Pending",
            book_date: null,
          })
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("message", "Bad Request");
            expect(res.body.errors).toContain("date is required");
            return done();
          });
      });
      test("this should return error status (400) of missing status", (done) => {
        request(app)
          .post("/queue")
          .send({
            CustomerId: 1,
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
        beforeEach((done) => {
          queryInterface.bulkInsert("Queues", [
            {
              CustomerId: 1,
              ServiceId: 1,
              status: "Pending",
              book_date: new Date(),
            },
          ]);
        })
          .then((_) => done())
          .catch((err) => done(err));
        afterEach((done) => {
          queryInterface.bulkDelete("Queues", {});
        })
          .then(() => done())
          .catch((err) => done(err));
        test("this should return error with status 401 not finish queue", (done) => {
          request(app)
            .post("/post")
            .send({
              CustomerId: 1,
              ServiceId: 2,
              status: "Pending",
              book_date: newDate(),
            })
            .end((err, res) => {
              if (err) done(err);
              expect(res.status).toBe(400);
              expect(res.body.errors).toContain("message", "You cannot have more than one ongoing booking");
              return done();
            });
        });
      });
    });
  });
  //Read Queue
  describe("read queues", () => {
    describe("success read queue", () => {
      test("should return data queue of object and status 200", (done) => {
        request(app)
          .get("/queue")
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).toBe(200);
            expect.any(Array);
            return done();
          });
      });
    });
    describe("success read queue by ", () => {
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
          .get("/queue/1")
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).toBe(200);
            expect.any(Array);
            return done();
          });
      });
    });
  });
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
          .patch(`/queue/${testId}`)
          .send(change)
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("message", "successfully update");
            return done();
          });
      });
    });
    describe('success edit queue status to "cancel"', () => {
      const changeToCancel = { ...change };
      changeToCancel.status = "cancel";
      test("should return status 200 and queue data", (done) => {
        request(app)
          .patch(`/queue/${testId}`)
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
      changeToCancel.status = "late";
      test("should return status 200 and queue data", (done) => {
        request(app)
          .patch(`/queue/${testId}`)
          .send(changeToLate)
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("status", changeToLate.status);
            return done();
          });
      });
    });
    descrive("error edit queue", () => {
      test("should return status 400 and error message", (done) => {});
    });
  });
});

//Service
describe("Service Table", () => {
  // Read service (DISPLAY)
  describe("Read Service", () => {
    describe("Success Porcess", () => {
      test("should return an array of object from service with status code (200)", (done) => {
        request(app)
          .get("/services")
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
