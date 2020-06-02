const { Customer } = require('../models')

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
}

module.exports = CustomerController