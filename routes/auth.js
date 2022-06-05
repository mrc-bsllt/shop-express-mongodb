const express = require('express')
const router = express.Router()

const { GET_login, POST_login, POST_logout, GET_signup, POST_signup } = require('../controllers/authController')

router.get('/login', GET_login)
router.post('/login', POST_login)

router.get('/signup', GET_signup)
router.post('/signup', POST_signup)

router.post('/logout', POST_logout)

module.exports = { authRoutes: router }