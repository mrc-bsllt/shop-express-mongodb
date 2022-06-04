const Product = require('../models/Product')
const User = require('../models/User')
// const Order = require('../models/Order')

const homePage = (req, res, next) => {
  console.log('FIRED HOMEPAGE')
  res.render('user/home-page', { path: 'homepage' })
}

const productsPage = (req, res, next) => {
  Product.find().then(products => {
    res.render('user/products', { products, path: 'products' })
  }).catch(error => console.log(error))
}

const productPage = (req, res, next) => {
  const id = req.params.id

  Product.findById(id).then(product => {
    res.render('user/product', { product, path: product.title })
  }).catch(error => console.log(error))
}

const cartPage = (req, res, next) => {
  req.user.populate('cart.product_id').then(user => {
    const products = user.cart
    let totalValue = 0

    products.forEach(prod => totalValue += prod.product_id.price * prod.quantity)

    res.render('user/cart', { products, totalValue, path: 'cart' })
    console.log(user.cart)
  }).catch(error => console.log(error))
}

const cartPost = (req, res, next) => {
  const prod_id = req.body.id
  
  Product.findById(prod_id).then(product => {
    req.user.addToCart(product).then(() => {
      res.redirect('/products')
    }).catch(error => console.log(error))
  }).catch(error => console.log(error))
}

const cartRemove = (req, res, next) => {
//   const prod_id = req.body.id

//   User.removeCartProduct(req.user, prod_id).then(() => {
//     res.redirect('/cart')
//   }).catch(error => console.log(error))
}

const createOrder = (req, res, next) => {
  const total_value = +req.body.total_value
  // User.getCartProducts(req.user.cart).then(products => {
  //   const order = new Order(req.user._id, products, total_value)
  //   order.save().then(() => {
  //     User.resetCart(req.user._id)
  //     res.redirect('/orders')
  //   }).catch(error => console.log(error))
  // }).catch(error => console.log(error))
}

const ordersPage = (req, res, next) => {
  // Order.getOrders(req.user._id).then(orders => {
  //   res.render('user/orders', { orders, path: 'orders' })
  // }).catch(error => console.log(error))
}

module.exports = { 
  homePage, 
  productsPage, 
  productPage, 
  cartPage, 
  cartPost, 
  cartRemove,
  createOrder,
  ordersPage 
}