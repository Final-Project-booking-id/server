const { Queue } = require('../models')
const { Op } = require('sequelize')

class QueueController {
  static create(req, res, next) {
    const { CustomerId, ServiceId } = req.body
    Queue.findAll({
      where: {
        [Op.and]: [
          { status: ['Pending', 'OnProgress'] },
          { CustomerId }
        ]
      }
    })
      .then(response => {
        if (response.length < 1) {
          Queue.create({ CustomerId, ServiceId })
            .then(response => {
              return res.status(201).json(response)
            })
            .catch(err => {
              return next(err)
            })
        } else {
          console.log(response, '<<<<<<<<<<<<<<<<<<<<<<INI MASUK ELSE BENER')
          return next({
            name: 'Bad Request',
            errors: [{ message: 'You cannot have more than one ongoing booking' }]
          })
        }
      })
  }
  static readByQueueId(req, res, next) {
    const { id } = req.params
    Queue.findOne({ where: { id: id } })
      .then(response => {
        return res.status(200).json(response)
      })
      .catch(err => {
        return next(err)
      })
  }

  static readByService(req, res, next) {
    const { id } = req.params
    Queue.findAll({
      where: {
        [Op.and]: [
          { ServiceId: id },
          { status: ['Pending', 'OnProgress'] }
        ]
      }
    })
      .then(response => {
        return res.status(200).json(response)
      })
      .catch(err => {
        return next(err)
      })
  }

  static readByCustUnfinished(req, res, next) {
    const { id } = req.params
    Queue.findOne(
      {
        where: {
          [Op.and]: [
            { status: ['Pending', 'OnProgress'] },
            { CustomerId: id }
          ]
        }
      }
    )
      .then(response => {
        return res.status(200).json(response)
      })
      .catch(err => {
        return next(err)
      })
  }

  static updateStatus(req, res, next) {
    const { id } = req.params
    
    Queue.update({
      ...req.body
    },
    {
      where: {
        id
      },
      returning: true
    })
    .then(response => {
      return res.status(200).json(response[1][0])
    })
    .catch(err => {
      return next(err)
    })
  }
}

module.exports = QueueController