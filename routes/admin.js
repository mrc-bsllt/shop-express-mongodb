const express = require('express')
const router = express.Router()

const { addProduct, 
        addProductPage, 
        editProductPage,
        editProduct,
        productsPage,
        deleteProduct } = require('../controllers/adminController')

router.post('/add-product', addProduct)
router.get('/add-product', addProductPage)

router.get('/edit/:id', editProductPage)
router.post('/edit-product', editProduct)

router.get('/products', productsPage)

router.post('/delete', deleteProduct)

module.exports = { adminRoutes: router }