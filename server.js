const path = require('path')
const express = require('express')

const session = require('express-session')

const mongoose = require('mongoose')
const MongoDBstore = require('connect-mongodb-session')(session)
const MONGODB_URI = 'mongodb+srv://mrc-bsllt:marcodevelon@cluster0.niomo.mongodb.net/shop'

const bodyParser = require('body-parser')

const csrf = require('csurf')
const csrfProtection = csrf()

const flash = require('connect-flash')

// MODELS
const User = require('./models/User')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

const store = new MongoDBstore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store
}))
app.use(csrfProtection)
app.use(flash()) // Serve per creare delle sessioni flash (quindi vengono cancellate dopo l'utilizzo). In questo caso le utilizzo per mandare gli errori che potrebbero essere generati dall'utente in fase di login/signup


const { userRoutes } = require('./routes/user')
const { adminRoutes } = require('./routes/admin')
const { authRoutes } = require('./routes/auth')

app.use((req, res, next) => {
  if(req.session.user) {
    User.findById(req.session.user._id).then(user => {
      req.user = user
      next()
    }).catch(error => console.log(user))
  } else {
    next()
  }
})

app.use((req, res, next) => { // Con res.locals posso passare delle variabili a tutte le viste che verranno renderizzate
  res.locals.user = req.session.user
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use(authRoutes)
app.use(userRoutes)
app.use('/admin', adminRoutes)
app.use('/', (req, res, next) => {
  res.status(404).render('404', { path: '404' })
})

mongoose.connect(`${MONGODB_URI}?retryWrites=true&w=majority`).then(() => {
  app.listen(3000)
}).catch(error => console.log(error))

  