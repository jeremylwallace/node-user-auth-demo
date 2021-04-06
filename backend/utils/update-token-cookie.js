const jwt = require('jsonwebtoken')

module.exports = (user, res) => {
    const token = jwt.sign(user, process.env.DEMO_JWT_SECRET, { expiresIn: '1d' })
    res.setHeader('Set-Cookie', `token=${token}`)
}