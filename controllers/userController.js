const Product = require('../models/Product')
const User = require('../models/User')

const homePage = (req, res, next) => {
  res.render('user/home-page', { path: 'homepage' })
}

const productsPage = (req, res, next) => {
  Product.fetchAll().then(products => {
    res.render('user/products', { products, path: 'products' })
  }).catch(error => console.log(error))
}

const productPage = (req, res, next) => {
  const id = req.params.id

  Product.getProductById(id).then(product => {
    res.render('user/product', { product, path: product.title })
  }).catch(error => console.log(error))
}

const cartPage = (req, res, next) => {
  User.getCartProducts(req.user.cart).then(products => {
    let totalValue = 0
    products.forEach(prod => totalValue += prod.price * prod.quantity)
    
    res.render('user/cart', { products, totalValue, path: 'cart' })
  }).catch(error => console.log(error))
}

const cartPost = (req, res, next) => {
  const prod_id = req.body.id
  
  User.addToCart(req.user, prod_id).then(() => {
    res.redirect('/products')
  }).catch(error => console.log(error))
}

const cartRemove = (req, res, next) => {
  // const id = +req.body.id
  // req.USER.getCart().then(cart => {
  //   return cart.getProducts({ where: { id } })
  // }).then(products => {
  //   const product = products[0]
  //   return product.cart_product.destroy()
  // }).then(() => {
  //   res.redirect('/cart')
  // }).catch(error => console.log(error))
}

const createOrder = (req, res, next) => {
  // const total_price = +req.body.total_price
  // return req.USER.getCart().then(cart => {
  //   cart.getProducts().then(products => {
  //     req.USER.createOrder({ total_price }).then(order => {
  //       order.addProducts(products.map(product => {
  //         product.order_product = { quantity: product.cart_product.quantity }
  //         return product
  //       })).then(() => {
  //         cart.setProducts(null)
  //         res.redirect('/orders')
  //       }).catch(error => console.log(error))
  //     }).catch(error => console.log(error))
  //   }).catch(error => console.log(error))
  // }).catch(error => console.log(error))
}

const ordersPage = (req, res, next) => {
  // req.USER.getOrders({ include: ['products'] }).then(orders => {
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