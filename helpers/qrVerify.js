const { verifyToken } = require('./jwt')

const qrVerify = (req, res, next) => {
    try {
        const { token } = req.body
        const payload = verifyToken(token)
        if (payload) {
            return res.status(200).json(payload)
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