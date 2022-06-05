const User = require('../models/User')

const GET_login = (req, res, next) => {
    res.render('auth/login', { path: 'login', user: req.session.user })
}
const POST_login = (req, res, next) => {
    User.findOne().then(user => {
        req.session.user = user
        req.session.save(error => {
            if(error) console.log(error)
            res.redirect('/')
        })
    }).catch(error => console.log(error))
}

const POST_logout = (req, res, next) => {
    req.session.destroy(error => {
        if(error) console.log(error)
        res.redirect('/products')
    })
}

module.exports = { GET_login, POST_login, POST_logout }