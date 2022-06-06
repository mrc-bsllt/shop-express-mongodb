const bcrypt = require('bcryptjs')

const sendGrid = require('@sendgrid/mail')
sendGrid.setApiKey(process.env.MAIL_KEY)

const User = require('../models/User')

const GET_login = (req, res, next) => {
    res.render('auth/login', { path: 'login', error: req.flash('error') })
}
const POST_login = (req, res, next) => {
    const { email, password } = req.body
    User.findOne({ email }).then(user => {
        if(!user) {
            req.flash('error', "email doesn't exist on our database")
            return res.redirect('/login')
        }

        bcrypt.compare(password, user.password).then(isValid => {
            if(!isValid) {
                req.flash('error', 'WRONG PASSWORD')
                return res.redirect('/login')
            }

            req.session.user = user
            req.session.save(error => {
                if(error) console.log(error)
                res.redirect('/products')
            })
        }).catch(error => console.log(error))
    }).catch(error => console.log(error))
}

const GET_signup = (req, res, next) => {
    res.render('auth/signup', { path: 'signup', error: req.flash('error') })
}
const POST_signup = (req, res, next) => {
    const { email, password, confirm_password } = req.body
    if(password !== confirm_password) {
        req.flash('error', "password filed doesn't match with confirm_password field")
        return res.redirect('/signup')
    }

    User.findOne({ email }).then(user => {
        if(user) {
            req.flash('error', 'email already exist!')
            return res.redirect('/signup')
        }
        
        bcrypt.hash(password, 12).then(hash_password => {
            const newUser = new User({ email, password: hash_password, cart: [] })
            return newUser.save().then(user => {
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
    }).catch(error => console.log(error))
}

const POST_logout = (req, res, next) => {
    req.session.destroy(error => {
        if(error) console.log(error)
        res.redirect('/products')
    })
}

module.exports = { GET_login, POST_login, POST_logout, GET_signup, POST_signup }