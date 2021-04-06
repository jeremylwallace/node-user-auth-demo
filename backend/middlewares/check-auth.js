const jwt = require('jsonwebtoken')

const db = require('../utils/db')
const updateTokenCookie = require('../utils/update-token-cookie')

const parseToken = (token) => {

    return new Promise((resolve, reject) => {
        const authed = jwt.verify(token, 'secret')
    
        db.get(`select * from Users WHERE id = $id;`, {
            $id: authed.id
        }, (err, row) => {
            if (!err && row) {
                resolve(row);
            } else {
                reject('user not found')   
            }
        })    
    })
}

module.exports = async (req, res, next) => {

    let token;
    try {

        if (req.headers.authorization) {
            token = req.headers.authorization.split('Bearer ')[1]
        } else if (req.headers.cookie) {
            token = req.headers.cookie.split('; ').find(cookie => cookie.startsWith('token=')).split('token=')[1]
        }

        const user = await parseToken(token)
        delete user.password
        updateTokenCookie(user, res)
        req.user = user
        next()
    } catch (err) {
        // res.status(401).json({ message: 'not authorized', loginUrl: '/login' })   
        res.redirect('/login')
    }
    // res.status(401).json({ message: 'not authorized', loginUrl: '/login' })   
}