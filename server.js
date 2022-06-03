const path = require('path')
const express = require('express')
const sequelize = require('./utils/database')

const Product = require('./models/Product')
const User = require('./models/User')
const Cart = require('./models/Cart')
const CartProduct = require('./models/CartProduct')
const Order = require('./models/Order')
const OrderProduct = require('./models/OrderProduct')

const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

const { userRoutes } = require('./routes/user')
const { adminRoutes } = require('./routes/admin')
const user = require('./routes/user')

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.USER = user
      next()
    }).catch(error => console.log(error))
})

app.use(userRoutes)
app.use('/admin', adminRoutes)
app.use('/', (req, res, next) => {
  res.status(404).render('404', { path: '404' })
})

Product.belongsTo(User)
User.hasMany(Product)

User.hasOne(Cart)
Cart.belongsTo(User)

Cart.belongsToMany(Product, { through: CartProduct })
Product.belongsToMany(Cart, { through: CartProduct })

User.hasMany(Order)
Order.belongsTo(User)

Order.belongsToMany(Product, { through: OrderProduct })
Product.belongsToMany(Order, { through: OrderProduct })

// sequelize.sync({ force: true })
sequelize.sync()
  .then(() => {
    return User.findByPk(1)
  }).then(user => {
    if(!user) {
      return User.create({ username: 'Marco', email: 'mrc@test.com' }).then(user => {
        user.createCart().then(cart => {
          app.listen(3000)
        }).catch(error => console.log(error))
      }).catch(error => console.log(error))
    } else {
      app.listen(3000)
    }}).catch(error => console.log(error))


  