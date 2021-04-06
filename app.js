const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')

const db = require('./backend/utils/db')
const checkAuth = require('./backend/middlewares/check-auth')

const app = express()

const userRoutes = require('./backend/routes/users')

app.use(bodyParser.json())

app.use(userRoutes)


// READ
app.get('/auth', checkAuth, (req, res) => {
    res.json(req.user)
})

// UPDATE

// DELETE

// FRONTEND
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'))
})
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'))
})
app.get('/account', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'account.html'))
})
app.get('/logout', checkAuth, (req, res) => {
    res.setHeader('Set-Cookie', `token=; expires=0`)
    res.redirect('/')
})
app.use(express.static(path.join(__dirname, 'public')))


module.exports = app;