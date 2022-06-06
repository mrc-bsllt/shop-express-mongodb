const bcrypt = require('bcryptjs')

const sendGrid = require('@sendgrid/mail')
sendGrid.setApiKey(process.env.MAIL_KEY)

const { validationResult } = require('express-validator')
const User = require('../models/User')

const GET_login = (req, res, next) => {
    res.render('auth/login', { path: 'login', errors: req.flash('errors') })
}
const POST_login = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).render('auth/login', { path: 'login', errors: errors.array() })
    }

    const { email } = req.body
    User.findOne({ email }).then(user => {
        req.session.user = user
        req.session.save(error => {
            if(error) console.log(error)
            res.redirect('/products')
        })
    }).catch(error => console.log(error))
}

const GET_signup = (req, res, next) => {
    res.render('auth/signup', { path: 'signup', errors: req.flash('errors') })
}
const POST_signup = async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).render('auth/signup', { path: 'signup', errors: errors.array() })
    }

    const { email, password } = req.body
    
    bcrypt.hash(password, 12).then(hash_password => {
        const newUser = new User({ email, password: hash_password, cart: [] })
        newUser.save().then(user => {
            req.session.user = user
            req.session.save(error => {
                if(error) console.log(error)
                const message = {
                    to: email,
                    from: 'mrc.bsllt@gmail.com',
                    subject: 'Confirm registration',
                    html: `<h1>Hi ${email}, you successfully signed up!!!</h1>`
                }
                sendGrid.send(message, (error, info) => {
                    if(error) {
                        console.log(error.response.body.errors)
                    }
                })
                res.redirect('/products')
            })
        }).catch(error => console.log(error))
    })
}

const POST_logout = (req, res, next) => {
    req.session.destroy(error => {
        if(error) console.log(error)
        res.redirect('/products')
    })
}

module.exports = { GET_login, POST_login, POST_logout, GET_signup, POST_signup }