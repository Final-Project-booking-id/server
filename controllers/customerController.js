const { Customer, Queue } = require('../models')

class CustomerController {
    static register(req, res, next) {
        let { police_number, password } = req.body
        Customer.create({ police_number, password })
            .then((response) => {
                const { dataValues } = response
                return res.status(201).json({
                    id: dataValues.id,
                    police_number: dataValues.police_number,
                    password: dataValues.password
                })
            }).catch(next)
    }

    static login(req, res, next) {
        let { police_number, password } = req.body
        Customer.findOne({
            where: {
                police_number,
                password
            }
        }).then((response) => {
            const { dataValues } = response
            return Queue.findOne({
                where: {
                    CustomerId: dataValues.id
                }
            })
        })
            .then((response) => {
                console.log(response)
                const { dataValues } = response
                return res.status(200).json({
                    id: dataValues.CustomerId,
                    QueueId: dataValues.id
                })
            }).catch(next)
    }
}

module.exports = CustomerController