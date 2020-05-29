const { Merchant } = require('../models')

class MerchantController {
  static readAllMerchant(req, res, next) {
    Merchant.findAll()
      .than((merchants) => {
        res.status(200).json(merchants)
      })
      .catch(next)
  }
}

module.exports = MerchantController