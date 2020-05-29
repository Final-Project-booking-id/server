const { Service } = require('../models')

class ServiceController {
  static readByMerchantId(req, res, next) {
    const { id } = req.params
    Service.findAll({
      where: {
        MerchantId: id
      }
    })
      .then(response => {
        return res.status(200).json(response)
      })
      .catch(err => {
        return next(err)
      })
  }
}

module.exports = ServiceController