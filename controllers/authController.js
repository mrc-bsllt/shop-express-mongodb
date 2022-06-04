const GET_login = (req, res, next) => {
    res.render('auth/login', { path: 'login' })
}
const POST_login = (req, res, next) => {
    // ...
}

module.exports = { GET_login, POST_login }