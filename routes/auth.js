const express = require('express')
const { check } = require('express-validator')
const bcrypt = require('bcryptjs')
const router = express.Router()

const User = require('../models/User')

const { GET_login, POST_login, POST_logout, GET_signup, POST_signup } = require('../controllers/authController')

router.get('/login', GET_login)
router.post('/login', 
  check('email', 'Invalid email!')
    .not().isEmpty().bail()
    .isEmail().bail()
    .custom(async (email) => {
      const user = await User.findOne({ email })
      if(!user) {
        return Promise.reject('Invalid email!')
      }
    }).bail(), 
  check('password', 'Invalid password!')
  .not().isEmpty().bail()
    .custom(async (password, { req }) => {
      const { email } = req.body
      const user = await User.findOne({ email })
      const isValidPassword = user ? await bcrypt.compare(password, user.password) : null
      
      if(!isValidPassword) {
        return Promise.reject('Invalid password!')
      }
    }).bail(),
  POST_login
)

router.get('/signup', GET_signup)
router.post('/signup', 
  check('email', 'Insert a valid Email!')
    .isEmail()
    .custom(async (email) => {
      const user = await User.findOne({ email })
      
      if(user) {
        return Promise.reject('Email already exist in our database!')
      }
    }), 
  check('password', 'Password does not respect the mandatory characters')
    .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 }),
  check('confirm_password')
    .custom((value, { req }) => {
      if(!req.body.password || value !== req.body.password) {
        throw new Error("password field doesn't match with confirm_password field")
      } else {
        return value
      }
    }),
  POST_signup
)

router.post('/logout', POST_logout)

module.exports = { authRoutes: router }