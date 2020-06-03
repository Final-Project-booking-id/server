const { Merchant } = require('../models')

class MerchantController {
  static readAllMerchant(req, res, next) {
    Merchant.findAll()
      .then((merchants) => {
        res.status(200).json(merchants)
      })
      .catch(next)
  }

  static createMerchant(req, res, next) {
    let { email, name, password, address, open_time, close_time } = req.body
    Merchant.create({ email, name, password, address, open_time, close_time })
      .then((response) => {
        const { dataValues } = response
        return res.status(201).json({
          id: dataValues.id,
          email: dataValues.email,
          name: dataValues.name,
          password: dataValues.password,
          address: dataValues.address,
          open_time: dataValues.open_time,
          close_time: dataValues.close_time
        })
      }).catch(next)
  }
}

module.exports = MerchantController