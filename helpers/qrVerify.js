const { verifyToken } = require('./jwt')
const { Queue } = require('../models')

const qrVerify = (req, res, next) => {
    try {
        const { token } = req.body
        const payload = verifyToken(token)
        if (payload) {
            Queue.findAll({
                where: {
                  [Op.and]: [
                    { ServiceId: payload.ServiceId },
                    { status: ['Pending', 'OnProgress'] }
                  ]
                }
              })
                .then(response => {
                  if (response[0].id === payload.id) {
                      return res.status(200).json(payload)
                  } else {
                      return next({
                          name: 'Forbidden',
                          errors: [{ message: `Not your queue's turn` }]
                      })
                  }
                })
                .catch(err => {
                  return next(err)
                })
        } else {
            return next({
                name: 'Not Found',
                errors: [{ message: 'Queue not found!' }]
            })
        }
    } catch (err) {
        return next(err)
    }
}

module.exports = qrVerify