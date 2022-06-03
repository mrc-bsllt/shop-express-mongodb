const Product = require('../models/Product')

// Add product POST
const addProduct = (req, res, next) => {
  const { title, price, image_url, description } = req.body
  req.USER.createProduct({ title, price, image_url, description })
    .then(() => {
      res.redirect('/admin/products')
    })
    .catch(error => console.log(error))
}

// GET add product form page
const addProductPage = (req, res, next) => {
  res.render('admin/add-product', { path: 'add-product' })
}

// GET edit product page
const editProductPage = (req, res, next) => {
  const id = +req.params.id
  Product.findByPk(id)
    .then(product => {
      res.render('admin/edit-product', { product, path: 'edit-product' })
    }).catch(error => console.log(error))
}
// POST edit product
const editProduct = (req, res, next) => { 
  const data = req.body
  const id = +data.id
  Product.findByPk(id)
    .then(product => {
      product.title = data.title
      product.image_url = data.image_url
      product.description = data.description
      product.price = +data.price
      return product.save()
    })
    .then(() => {
      res.redirect('/admin/products')
    }).catch(error => console.log(error))
}

// GET admin products list
const productsPage = (req, res, next) => {
  req.USER.getProducts()
    .then(products => {
      res.render('admin/products', { products, path: 'admin-products' })
    }).catch(error => console.log(error))
}

// POST delete product
const deleteProduct = (req, res, next) => {
  const id = +req.body.id
  Product.findByPk(id)
    .then(product => {
      product.destroy()
    })
    .then(() => {
      res.redirect('/admin/products')
    }).catch(error => console.log(error))
}

module.exports = { addProduct, addProductPage, editProductPage, editProduct, productsPage, deleteProduct }