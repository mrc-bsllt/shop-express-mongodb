const Product = require('../models/Product')

// GET admin products list
const productsPage = (req, res, next) => {
  Product.fetchAll().then(products => {
      res.render('admin/products', { products, path: 'admin-products' })
    }).catch(error => console.log(error))
}

// Add product POST
const addProduct = (req, res, next) => {
  const { title, price, image_url, description } = req.body
  const user_id = req.user._id
  const product = new Product(title, price, image_url, description, user_id)

  product.save().then(() => {
      res.redirect('/admin/products')
    }).catch(error => console.log(error))
}

// GET add product form page
const addProductPage = (req, res, next) => {
  res.render('admin/add-product', { path: 'add-product' })
}

// GET edit product page
const editProductPage = (req, res, next) => {
  const id = req.params.id

  Product.getProductById(id).then(product => {
    res.render('admin/edit-product', { product, path: 'edit-product' })
  }).catch(error => console.log(error))
}
// POST edit product
const editProduct = (req, res, next) => { 
  const { id, title, image_url, price, description } = req.body
  const user_id = req.user._id
  const product = new Product(title, price, image_url, description, user_id)

  product.update(id).then(() => {
    res.redirect('/admin/products')
  }).catch(error => console.log(error))
}

// POST delete product
const deleteProduct = (req, res, next) => {
  const prod_id = req.body.id

  Product.deleteById(prod_id, req.user.cart).then(() => {
    res.redirect('/admin/products')
  }).catch(error => console.log(error))
}

module.exports = { addProduct, addProductPage, editProductPage, editProduct, productsPage, deleteProduct }