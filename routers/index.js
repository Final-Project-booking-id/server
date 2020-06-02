const router = require('express').Router()
const QueueController = require('../controllers/queueController')
const ServiceController = require('../controllers/serviceController')
const MerchantController = require('../controllers/merchantController')
const qrVerify = require('../helpers/qrVerify')
const CustomerController = require('../controllers/customerController')

//CUSTOMER REGISTER
router.post('/register', CustomerController.register)

//GET HISTORY
router.get('/queue/serviceHistory/:id', QueueController.readHistory)

//SERVICE
router.get('/service/:id', ServiceController.readByMerchantId)

//MERCHANT
router.get('/merchant', MerchantController.readAllMerchant)

//QUEUE
router.get('/queue/:id', QueueController.readByQueueId)
//Mencari antrian berdasarkan service id, gunanya untuk menampilkan antrian yang sedang berjalan dalam sebuah service, ditampilkan di client customer dan merchant
router.get('/queue/service/:id', QueueController.readByService)
//Mencari booking yang dibuat oleh customer yang sedang berlangsung (status Pending atau In progress), ditampilkan di client customer
router.get('/queue/unfinishedCust/:id', QueueController.readByCustUnfinished)
router.post('/queue', QueueController.create)
router.patch('/queue/:id', QueueController.updateStatus)

//QR VERIFY
router.post('/verify', qrVerify)

module.exports = router