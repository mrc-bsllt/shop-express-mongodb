const express = require('express')
const router = express.Router()

const is_auth = require('../middleware/is_auth')

const { addProduct, 
        addProductPage, 
        editProductPage,
        editProduct,
        productsPage,
        deleteProduct } = require('../controllers/adminController')

router.post('/add-product', is_auth, addProduct)
router.get('/add-product', is_auth, addProductPage)

router.get('/edit/:id', is_auth, editProductPage)
router.post('/edit-product', is_auth, editProduct)

router.get('/products', is_auth, productsPage)

router.post('/delete', is_auth, deleteProduct)

module.exports = { adminRoutes: router }