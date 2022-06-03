const path = require('path')
const express = require('express')
const { mongoConnect } = require('./utils/database')

const bodyParser = require('body-parser')

// MODELS
const User = require('./models/User')

const app = express()

app.use((req, res, next) => {
  User.getUserByEmail('mrc@mail.com').then(user => {
    req.user = user
    next()
  }).catch(error => console.log(error))
})

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

const { userRoutes } = require('./routes/user')
const { adminRoutes } = require('./routes/admin')

app.use(userRoutes)
app.use('/admin', adminRoutes)
app.use('/', (req, res, next) => {
  res.status(404).render('404', { path: '404' })
})

mongoConnect(() => {
  User.fetchUsers().then(users => {
    if(!users.length) {
      const user = new User('mrc.bsllt', 'mrc@mail.com')
      user.save().then(() => {
        app.listen(3000)
      }).catch(error => console.log(error))
    } else {
      app.listen(3000)
    }
  }).catch(error => console.log(error))
})

  