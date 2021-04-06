const router = require('express').Router()

const checkAuth = require('../middlewares/check-auth')

const userController = require('../controllers/users')

router.post('/register', userController.createUser)
router.post('/login', userController.loginUser)
router.put('/account', checkAuth, userController.updateUser)

module.exports = router