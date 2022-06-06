const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const sendGrid = require('@sendgrid/mail')
sendGrid.setApiKey(process.env.MAIL_KEY)

const { validationResult } = require('express-validator')
const User = require('../models/User')

const GET_login = (req, res, next) => {
    res.render('auth/login', { path: 'login', errors: [], old_value: null })
}
const POST_login = (req, res, next) => {
    const { email, password } = req.body

    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).render('auth/login', { path: 'login', errors: errors.array(), old_value: { email, password } })
    }

    User.findOne({ email }).then(user => {
        req.session.user = user
        req.session.save(error => {
            if(error) console.log(error)
            res.redirect('/products')
        })
    }).catch(error => console.log(error))
}

const GET_signup = (req, res, next) => {
    res.render('auth/signup', { path: 'signup', errors: [], old_value: null })
}
const POST_signup = async (req, res, next) => {
    const { email, password } = req.body

    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).render('auth/signup', { path: 'signup', errors: errors.array(), old_value: { email, password } })
    }
    
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

const GET_restorePassword = (req, res, next) => {
    res.render('auth/restore-password', { path: 'restore-password', errors: [] })
}
const POST_restorePassword = (req, res, next) => {    
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.render('auth/restore-password', { path: 'restore-password', errors: errors.array() })
    }

    crypto.randomBytes(32, (error, buffer) => {
        if(error) {
            console.log(error)
            return res.redirect('/products')
        }

        const reset_token = buffer.toString('hex')
        const token_expire = Date.now() + 3600000
        const { email } = req.body
        
        User.findOne({ email }).then(user => {
            user.reset_token = reset_token
            user.token_expire = token_expire

            return user.save().then(() => {
                res.redirect('/login')
                const message = {
                    to: email,
                    from: 'mrc.bsllt@gmail.com',
                    subject: 'Reset Password',
                    html: `<p>Ciao ${email}, ci è arrivata una richiesta da parte tua di cambiare password. Clicca al seguente <a href="http://localhost:3000/reset-password/${reset_token}">LINK</a></p>`
                }
                sendGrid.send(message, (error, info) => {
                    if(error) {
                        console.log(error.response.body.errors)
                    }
                })
            }).catch(error => console.log(error))
        }).catch(error => error)
    })
}

module.exports = { GET_login, POST_login, POST_logout, GET_signup, POST_signup, GET_restorePassword, POST_restorePassword }