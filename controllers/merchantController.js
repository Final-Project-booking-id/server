const { Merchant } = require('../models')

class MerchantController {
  static readAllMerchant(req, res, next) {
    Merchant.findAll()
      .then((merchants) => {
        res.status(200).json(merchants)
      })
      .catch(next)
  }
}

module.exports = MerchantController