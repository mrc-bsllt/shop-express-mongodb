const express = require('express')
const router = express.Router()

const { GET_login, POST_login, POST_logout } = require('../controllers/authController')

router.get('/login', GET_login)
router.post('/login', POST_login)

router.post('/logout', POST_logout)

module.exports = { authRoutes: router }