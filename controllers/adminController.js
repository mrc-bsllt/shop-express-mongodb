const { deleteFile } = require('../utils/delete-file')
const Product = require('../models/Product')

// GET admin products list
const productsPage = (req, res, next) => {
  Product.find({ user_id: req.session.user._id }).then(products => {
      res.render('admin/products', { products, path: 'admin-products' })
    }).catch(error => console.log(error))
}

// Add product POST
const addProduct = (req, res, next) => {
  const { title, price, description } = req.body
  const image = req.file
  const user_id = req.user
  
  if(!image) {
    req.flash('errors', 'Image format not valid!')
    return res.redirect('/admin/add-product')
  }
  
  const image_url = '/' + image.path
  const product = new Product({ title, price, image_url, description, user_id })

  product.save().then(() => {
      res.redirect('/admin/products')
    }).catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

// GET add product form page
const addProductPage = (req, res, next) => {
  res.render('admin/add-product', { path: 'add-product', errors: req.flash('errors') })
}

// GET edit product page
const editProductPage = (req, res, next) => {
  const id = req.params.id

  Product.findOne({ id }).then(product => {
    res.render('admin/edit-product', { product, path: 'edit-product', errors: req.flash('errors') })
  }).catch(err => {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  })
}
// POST edit product
const editProduct = (req, res, next) => { 
  const { id, title, price, description } = req.body
  const image = req.file
  const user_id = req.user

  if(!image) {
    const product = { id, title, price, description, image }
    req.flash('errors', 'Image format not valid!')
    return res.render('admin/edit-product', { product, path: 'edit-product', errors: req.flash('errors') })
  }

  Product.findOne({ id }).then(product => {
    deleteFile(product.image_url)
    product.title = title
    product.image_url = '/' + image.path
    product.price = price
    product.description = description
    product.user_id = user_id
    return product.save()
  }).then(() => {
    res.redirect('/admin/products')
  }).catch(err => {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  })
}

// POST delete product
const deleteProduct = (req, res, next) => {
  const prod_id = req.body.id

  Product.findOneAndDelete({ _id: prod_id }).then(product => {
    const isInCart = req.user.cart.findIndex(prod => prod.product_id.toString() === product._id.toString()) > -1
    deleteFile(product.image_url)

    if(isInCart) {
      req.user.removeToCart(product._id).then(() => {
        res.redirect('/admin/products')
      }).catch(error => next(new Error(error)))
    } else {
      res.redirect('/admin/products')
    }
  }).catch(err => {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  })
}

module.exports = { addProduct, addProductPage, editProductPage, editProduct, productsPage, deleteProduct }