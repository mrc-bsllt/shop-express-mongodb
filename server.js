const path = require('path')
const express = require('express')
const mongoose = require('mongoose')

const bodyParser = require('body-parser')

// MODELS
const User = require('./models/User')

const app = express()

app.use((req, res, next) => {
  User.findOne().then(user => {
    req.user = user
  }).catch(error => console.log(error))
})

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

// const { userRoutes } = require('./routes/user')
// const { adminRoutes } = require('./routes/admin')

// app.use(userRoutes)
// app.use('/admin', adminRoutes)
app.use('/', (req, res, next) => {
  res.status(404).render('404', { path: '404' })
})

mongoose.connect('mongodb+srv://mrc-bsllt:marcodevelon@cluster0.niomo.mongodb.net/shop?retryWrites=true&w=majority').then(() => {
  User.find().then(users => {
    if(!users.length) {
      const user = new User({ username: 'mrc-bsllt', email: 'mrc@test.com', cart: [] })
      user.save().then(() => {
        app.listen(3000)
      }).catch(error => console.log(error))
    } else {
      app.listen(3000)
    }
  }).catch(error => console.log(error))
}).catch(error => console.log(error))

  