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


// console.log(merchantsjson, '<<<<<MERCHANT>>>>>>')
// console.log(customersjson, '<<<<<CUSTOMER>>>>>>')
// console.log(servicesjson, '<<<<<SERVICES>>>>>>')
// afterAll((done) => {
//   queryInterface
//     .bulkDelete("Merchants", {})
//     .then((_) => {
//       return queryInterface.bulkDelete("Customers", {})
//     })
//     .then((_) => {
//       return queryInterface.bulkDelete("Services", {})
//     })
//     .then((_) => {
//       return queryInterface.bulkDelete("Queues", {})
//       done();
//     })
//     .catch((err) => {
//       done(err);
//     });
// });

beforeAll((done) => {
  queryInterface
    .bulkInsert("Merchants", merchantsjson)
    .then((result) => {
      // console.log(result, '<<<<<<<<<<<<< MERCHANT')
      return queryInterface.bulkInsert("Customers", customersjson)
    })
    .then((result) => {
      // console.log(result, "<<<<<<<<<<<<<<<<RREESUUULLTTT")
      return queryInterface.bulkInsert("Services", servicesjson)
    })
    .then((result) => {
      // console.log(result, '<<<< servisecc >>>')
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
          CustomerId: 7,
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