const express = require('express')
const router = express.Router()

const { GET_login, POST_login } = require('../controllers/authController')

router.get('/login', GET_login)
router.post('/login', POST_login)

module.exports = { authRoutes: router }