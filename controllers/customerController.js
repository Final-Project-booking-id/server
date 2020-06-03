const { Customer } = require('../models')

class CustomerController {
    static register(req, res, next) {
        let { police_number, password } = req.body
        Customer.create({ police_number, password })
            .then((response) => {
                const { dataValues } = response
                return res.status(201).json({
                    id: dataValues.id,
                    police_number: dataValues.police_number
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
        })
        .then((response) => {
            if (response) {
                const { dataValues } = response
                return res.status(200).json({
                    id: dataValues.id
                })
            } else {
                return next({
                    name: 'Bad Request',
                    errors: [{ message: 'Invalid Username/Password' }]
                })
            }
        }).catch(next)
    }
}

module.exports = CustomerController