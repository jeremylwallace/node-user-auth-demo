const jwt = require('jsonwebtoken')

module.exports = (user, res) => {
    const token = jwt.sign(user, 'secret', { expiresIn: '1d' })
    res.setHeader('Set-Cookie', `token=${token}`)
}