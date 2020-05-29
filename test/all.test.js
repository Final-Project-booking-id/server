const { app } = require("../app")
const request = require("supertest")
const { sequelize } = require('../models')
const { queryInterface } = sequelize


// Create queue - Done
// Read queue unfinish - Done
// Edit queue on progress based on id finish
// Edit queue on progress based on id cancel
// Edit queue on progress based on id late
// Read owner - Done
// Read service - Done
// Validasi create queue: not null except checkout
// Validasi create queue: on progress (prohibited), 

const testId = null

//Queue
describe('Queue Table', () => {
    // Create queue
    afterAll(done => {
        queryInterface
            .bulkDelete('Queues', {})
            .then(() => done())
            .catch(err => done(err))
    })
    describe('create queue', () => {
        describe('success create queue', () => {
            test('this should return with id and data of queue', done => {
                const inputQueue = {
                    customer_id: 1,
                    service_id: 1,
                    status: 'pending',
                    book_date: '2020-05-29T02:07:51.682Z',
                    check_in: false,
                    check_out: false
                }
                request(app)
                    .post('/queues')
                    .send(inputQueue)
                    .end((err, res) => {
                        if (err) done(err)
                        testId = res.body.id
                        expect(res.status).toBe(201)
                        expect(res.body).toHaveProperty('id', expect.any(Number))
                        expect(res.body).toHaveProperty('customer_id', inputQueue.customer_id)
                        expect(res.body).toHaveProperty('service_id', inputQueue.service_id)
                        expect(res.body).toHaveProperty('book_date', expect.any(String))
                        expect(res.body).toHaveProperty('check_in', inputQueue.check_in)
                        expect(res.body).toHaveProperty('check_out', inputQueue.check_out)
                        return done()
                    })
            })
        })
        describe('error process', () => {
            test('this should return error status (400) of missing customer id', done => {
                request(app)
                    .post('/queues')
                    .send({
                        customer_id: null,
                        service_id: 1,
                        status: 'pending',
                        book_date: '2020-05-29T02:07:51.682Z',
                        check_in: false,
                        check_out: false
                    })
                    .end((err, res) => {
                        if (err) done(err)
                        expect(res.status).toBe(400)
                        expect(res.body).toHaveProperty('message', 'Bad Request')
                        return done()
                    })
            })
            test('this should return error status (400) of missing service id', done => {
                request(app)
                    .post('/queues')
                    .send({
                        customer_id: 1,
                        service_id: null,
                        status: 'pending',
                        book_date: '2020-05-29T02:07:51.682Z',
                        check_in: false,
                        check_out: false
                    })
                    .end((err, res) => {
                        if (err) done(err)
                        expect(res.status).toBe(400)
                        expect(res.body).toHaveProperty('message', 'Bad Request')
                        return done()
                    })
            })
            test('this should return error status (400) of missing book date', done => {
                request(app)
                    .post('/queues')
                    .send({
                        customer_id: 1,
                        service_id: 1,
                        status: 'pending',
                        book_date: null,
                        check_in: false,
                        check_out: false
                    })
                    .end((err, res) => {
                        if (err) done(err)
                        expect(res.status).toBe(400)
                        expect(res.body).toHaveProperty('message', 'Bad Request')
                        expect(res.body.errors).toContain('date is required')
                        return done()
                    })
            })
            test('this should return error status (400) of missing status', done => {
                request(app)
                    .post('/queues')
                    .send({
                        customer_id: 1,
                        service_id: 1,
                        status: null,
                        book_date: '2020-05-29T02:07:51.682Z',
                        check_in: false,
                        check_out: false
                    })
                    .end((err, res) => {
                        if (err) done(err)
                        expect(res.status).toBe(400)
                        expect(res.body).toHaveProperty('message', 'Bad Request')
                        return done()
                    })
            })
            test('this should return error status (400) of missing check in', done => {
                request(app)
                    .post('/queues')
                    .send({
                        customer_id: 1,
                        service_id: 1,
                        status: 'pending',
                        book_date: '2020-05-29T02:07:51.682Z',
                        check_in: null,
                        check_out: false
                    })
                    .end((err, res) => {
                        if (err) done(err)
                        expect(res.status).toBe(400)
                        expect(res.body).toHaveProperty('message', 'Bad Request')
                        return done()
                    })
            })
            test('this should return error status (400) of missing check out', done => {
                request(app)
                    .post('/queues')
                    .send({
                        customer_id: 1,
                        service_id: 1,
                        status: 'pending',
                        book_date: '2020-05-29T02:07:51.682Z',
                        check_in: false,
                        check_out: null
                    })
                    .end((err, res) => {
                        if (err) done(err)
                        expect(res.status).toBe(400)
                        expect(res.body).toHaveProperty('message', 'Bad Request')
                        return done()
                    })
            })
        })
    })
    //Read Queue
    describe('read queues', () => {
        describe('success read queue', () => {
            test('should return data queue of object and status 200', done => {
                request(app)
                    .get('/queues')
                    .end((err, res) => {
                        if (err) done(err)
                        expect(res.status).toBe(200)
                        expect.any(Array)
                        return done()
                    })
            })
        })
    })
    //Edit Queue
    describe('edit queue', () => {
        const change = {
            customer_id: 1,
            service_id: 1,
            status: 'finish',
            book_date: '2020-05-29T02:07:51.682Z',
            check_in: false,
            check_out: false
        }
        describe('success edit queue status to "finish"', () => {
            test('should return status 200 and queue data', done => {
                request(app)
                    .patch(`/queues/${testId}`)
                    .send(change)
                    .end((err, res) => {
                        if (err) done(err)
                        expect(res.status).toBe(200)
                        expect(res.body).toHaveProperty('status', change.status)
                        return done()
                    })

            })
        })
        describe('success edit queue status to "cancel"', () => {
            const changeToCancel = { ...change }
            changeToCancel.status = 'cancel'
            test('should return status 200 and queue data', done => {
                request(app)
                    .patch(`/queues/${testId}`)
                    .send(changeToCancel)
                    .end((err, res) => {
                        if (err) done(err)
                        expect(res.status).toBe(200)
                        expect(res.body).toHaveProperty('status', changeToCancel.status)
                        return done()
                    })
            })
        })
        describe('success edit queue status to "late"', () => {
            const changeToLate = { ...change }
            changeToCancel.status = 'late'
            test('should return status 200 and queue data', done => {
                request(app)
                    .patch(`/queues/${testId}`)
                    .send(changeToLate)
                    .end((err, res) => {
                        if (err) done(err)
                        expect(res.status).toBe(200)
                        expect(res.body).toHaveProperty('status', changeToLate.status)
                        return done()
                    })
            })
        })
    })
})

//Service
describe('Service Table', () => {
    // Read service (DISPLAY)
    describe('Read Service', () => {
        beforeEach((done) => {
            queryInterface.bulkInsert('Services', [
                {
                    owner_id: 1,
                    queue_id: 1,
                    name: 'Cuci Mobil',
                    estimation_time: 15
                },
                {
                    owner_id: 1,
                    queue_id: 2,
                    name: 'Cuci Mobil',
                    estimation_time: 15
                }
            ])
                .then(_ => {
                    done()
                })
                .catch(err => {
                    done(err)
                })
        })
        afterEach((done) => {
            queryInterface.bulkDelete('Services', {})
                .then(_ => {
                    done()
                })
                .catch(err => {
                    done(err)
                })
        })
        describe('Success Porcess', () => {
            test('should return an array of object from service with status code (200)', (done) => {
                request(app)
                    .get('/services')
                    .end((err, res) => {
                        if (err) done(err)
                        expect(res.status).toBe(200)
                        expect.any(Array)
                        return done()
                    })
            })
        })
    })
})

//Owner
describe('Owner Table', () => {
    // Read Owner (DISPLAY)
    describe('Read Owner', () => {
        beforeEach((done) => {
            queryInterface.bulkInsert('Owners', [
                {
                    email: 'test@mail.com',
                    password: '123456',
                    name: 'Owner 1',
                    address: 'st. John'
                },
                {
                    email: 'test2@mail.com',
                    password: '123456',
                    name: 'Owner 2',
                    address: 'st. Doe'
                }
            ])
                .then(_ => {
                    done()
                })
                .catch(err => {
                    done(err)
                })
        })
        afterEach((done) => {
            queryInterface.bulkDelete('Owners', {})
                .then(_ => {
                    done()
                })
                .catch(err => {
                    done(err)
                })
        })
        describe('Success Porcess', () => {
            test('should return an array of object from owners with status code (200)', (done) => {
                request(app)
                    .get('/owners')
                    .end((err, res) => {
                        if (err) done(err)
                        expect(res.status).toBe(200)
                        expect.any(Array)
                        return done()
                    })
            })
        })
    })
})