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
        return Promise.reject('This email doesn\'t exist yet!')
      }
    }).bail(), 
  check('password', 'Invalid password!')
  .not().isEmpty().bail()
    .custom(async (password, { req }) => {
      const { email } = req.body
      const user = await User.findOne({ email })
      const isValidPassword = await bcrypt.compare(password, user.password)
      
      if(!isValidPassword) {
        return Promise.reject('WRONG PASSWORD!')
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
    .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 })
    .custom((value, { req }) => {
      if(value !== req.body.confirm_password) {
        throw new Error("password filed doesn't match with confirm_password field")
      } else {
        return value
      }
    }),
  POST_signup
)

router.post('/logout', POST_logout)

module.exports = { authRoutes: router }