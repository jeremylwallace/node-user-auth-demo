const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../utils/db')

const updateTokenCookie = require('../utils/update-token-cookie')

const createUser = async (req, res) => {

    bcrypt.hash(req.body.password, 12)
        .then(hashed => {

            // to db here
            db.run('INSERT INTO Users (name, email, password) VALUES ($name, $email, $password);', {
                $name: req.body.name,
                $email: req.body.email,
                $password: hashed
            }, function (err) {
                if (err) {
                    return res.status(403).json({ message: 'error creating user', error: err })
                }
                db.get(`SELECT * FROM Users WHERE id = $id`, {
                    $id: this.lastID
                }, function(err, row) {
                    if (err) {
                        return res.status(403).json({ message: 'error creating user', error: err })
                    } else {
                        delete row.password
                        updateTokenCookie(row, res)
                        return res.json(row)
                    }
                })
            })
        }).catch(err => {
            console.log(err)
            return res.status(500).json({ message: 'error creating user', error: err })
        });
}

const loginUser = async (req, res) => {

    db.get(`select * from Users WHERE email = $email;`, {
        $email: req.body.email
    }, (err, user) => {
        if (!err && user) {
            bcrypt.compare(req.body.password, user.password, (err, same) => {
                if (!err && same) {
                    // login successful
                    delete user.password
                    updateTokenCookie(user, res)
                    return res.json({user})
                } 
                res.status(401).json({ message: 'not authorized', loginUrl: '/login' })
            })
        } else {
            res.status(401).json({ message: 'not authorized', loginUrl: '/login' })
        }
    })
}

const updateUser = async (req, res) => {

    db.get(`SELECT * FROM Users WHERE id = $id;`, { $id: req.user.id }, (err, user) => {
        bcrypt.compare(req.body.verifyPassword, user.password, (err, same) => {
            if (!err && same) {
                // user password has been verified, okay to update
                let sql = 'UPDATE Users SET '

                const params = {
                    $id: req.user.id
                }
            
                if (req.body.newPassword) {
                    params.$password = bcrypt.hashSync(req.body.newPassword, 12);
                    sql += `password = $password, `
                }
            
                if (req.body.name) {
                    params.$name = req.body.name;
                    sql += `name = $name, `
                }
            
                if (req.body.email) {
                    params.$email = req.body.email;
                    sql += `email = $email, `
                }
            
                // remove final trailing comma
                sql = sql.substr(0, sql.length - 2)
            
                sql += ` WHERE id = $id;`
            
                db.run(sql, params, function (err) {
                    if (err) {
                        res.status(500).json({ message: 'error updating user', error: err })
                    } else {
                        db.get(`select * from Users WHERE id = $id`, { $id: req.user.id }, (err, row) => {
                            if (err || !row) {
                                res.status(500).json({ message: 'error retrieving user after update', error: err })
                            } else {
                                delete row.password;
                                updateTokenCookie(row, res)
                                res.json(row)
                            }
                        })
                    }
                })
            } else {
                res.status(401).json({ message: 'Incorrect email or password.'})
            }
        })
    })

}

module.exports = {
    createUser,
    loginUser,
    updateUser
}