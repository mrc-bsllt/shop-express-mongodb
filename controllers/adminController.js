const Product = require('../models/Product')

// GET admin products list
const productsPage = (req, res, next) => {
  Product.find({ user_id: req.session.user._id }).then(products => {
      res.render('admin/products', { products, path: 'admin-products', user: req.session.user })
    }).catch(error => console.log(error))
}

// Add product POST
const addProduct = (req, res, next) => {
  const { title, price, image_url, description } = req.body
  const user_id = req.session.user
  const product = new Product({ title, price, image_url, description, user_id })

  product.save().then(() => {
      res.redirect('/admin/products')
    }).catch(error => console.log(error))
}

// GET add product form page
const addProductPage = (req, res, next) => {
  res.render('admin/add-product', { path: 'add-product', user: req.session.user })
}

// GET edit product page
const editProductPage = (req, res, next) => {
  const id = req.params.id

  Product.findById(id).then(product => {
    res.render('admin/edit-product', { product, path: 'edit-product', user: req.session.user })
  }).catch(error => console.log(error))
}
// POST edit product
const editProduct = (req, res, next) => { 
  const { id, title, image_url, price, description } = req.body
  const user_id = req.session.user

  Product.findById(id).then(product => {
    product.title = title
    product.image_url = image_url
    product.price = price
    product.description = description
    product.user_id = user_id
    return product.save()
  }).then(() => {
    res.redirect('/admin/products')
  }).catch(error => console.log(error))
}

// POST delete product
const deleteProduct = (req, res, next) => {
  const prod_id = req.body.id
  console.log('prod_id', prod_id)

  Product.findOneAndDelete({ _id: prod_id }).then(product => {
    console.log('PRODUCT', product)
    const isInCart = req.user.cart.findIndex(prod => prod.product_id.toString() === product._id.toString()) > -1
    
    if(isInCart) {
      req.user.removeToCart(product._id).then(() => {
        res.redirect('/admin/products')
      }).catch(error => console.log(error))
    } else {
      res.redirect('/admin/products')
    }
  }).catch(error => console.log(error))
}

module.exports = { addProduct, addProductPage, editProductPage, editProduct, productsPage, deleteProduct }