const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit')

const Product = require('../models/Product')
const Order = require('../models/Order')

const homePage = (req, res, next) => {
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
  const prod_id = req.body.id
  
  Product.findById(prod_id).then(product => {
    return req.user.removeToCart(product._id)
  }).then(() => {
    res.redirect('/cart')
  }).catch(error => console.log(error))
}

const createOrder = (req, res, next) => {
  const user_id = req.session.user
  const total_value = +req.body.total_value

  const prod_ids = req.user.cart.map(item => item.product_id)
  Product.find({ _id: { $in: prod_ids }}).then(products => {
    const updatedProducts = products.map(item => {
      const quantity = req.user.cart.find(el => el.product_id.toString() === item._id.toString()).quantity
      return { product: { ...item }, quantity }
    })
    
    const order = new Order({ user_id, products: updatedProducts, total_value })
    order.save().then(() => {
      req.user.resetCart()
      res.redirect('/orders')
    }).catch(error => console.log(error))
  }).catch(error => console.log(error))
}

const ordersPage = (req, res, next) => {
  Order.find({ user_id: req.user._id }).populate('user_id', '-cart').then(orders => {
    res.render('user/orders', { orders, path: 'orders' })
  }).catch(error => console.log(error))
}

const GET_downloadOrder = (req, res, next) => {
  const { order_id } = req.params
  const fileName = 'invoice-' + order_id + '.pdf'
  const invoicePath = path.join('storage', 'pdf', fileName)
  
  Order.findOne({ _id: order_id }).then(order => {
    const pdf = new PDFDocument()
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'inline; filename="' + fileName + '"')
    pdf.pipe(fs.createWriteStream(invoicePath))
    pdf.pipe(res)
    pdf.fontSize(26).text('Invoice: #' + order_id)
    pdf.text('----------------------------')
    pdf.fontSize(18).text(req.user.email, { underline: true })
    order.products.forEach(product => {
      pdf.text(`${product.product.title}: ${product.product.price}$    x${product.quantity}`)
    })
    pdf.text(`TOTAL: ${order.total_value}$`)
    pdf.end()
  }).catch(err => {
    const error = new Error(error)
    error.httpStatus = 500
    return next(error)
  })
}

module.exports = { 
  homePage, 
  productsPage, 
  productPage, 
  cartPage, 
  cartPost, 
  cartRemove,
  createOrder,
  ordersPage,
  GET_downloadOrder
}