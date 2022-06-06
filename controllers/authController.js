const User = require('../models/User')
const bcrypt = require('bcryptjs')

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