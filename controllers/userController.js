const Product = require('../models/Product')

const homePage = (req, res, next) => {
  res.render('user/home-page', { path: 'homepage' })
}

const productsPage = (req, res, next) => {
  Product.fetchAll().then(products => {
    res.render('user/products', { products, path: 'products' })
  }).catch(error => console.log(error))
}

const productPage = (req, res, next) => {
  // const id = +req.params.id
  // Product.findByPk(id)
  //   .then(product => {
  //     res.render('user/product', { product, path: product.title })
  //   }).catch(error => console.log(error))
}

const cartPage = (req, res, next) => {
  // req.USER.getCart().then(cart => {
  //   cart.getProducts().then(products => {
  //     let totalValue = 0
  //     products.forEach(el => totalValue += el.price * el.cart_product.quantity)
      
  //     res.render('user/cart', { products, totalValue, path: 'cart' })
  //   }).catch(error => console.log(error))
  // }).catch(error => console.log(error))
}

const cartPost = (req, res, next) => {
  // const id = +req.body.product_id
  // req.USER.getCart().then(cart => {
  //   cart.getProducts().then(cartProducts => { 
  //     const prodIndex = cartProducts.findIndex(el => el.id === id)
  //     if(prodIndex < 0) {

  //       return Product.findByPk(id).then(product => {
  //         cart.addProduct(product, { through: { CartProduct } }).then(() => {
  //           res.redirect('/cart')
  //         }).catch(error => console.log(error))
  //       }).catch(error => console.log(error))

  //     } else {

  //       const product = cartProducts.find(el => el.id === id)
  //       const quantity = product.cart_product.quantity + 1
  //       cart.addProduct(product, { through: { quantity } }).then(() => {
  //         res.redirect('/cart')
  //       }).catch(error => console.log(error))

  //     }
  //   }).catch(error => console.log(error))
  // }).catch(error => console.log(error))
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