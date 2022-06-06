const express = require('express')
const router = express.Router()

const is_auth = require('../middleware/is_auth')

const { homePage, 
        productsPage, 
        productPage, 
        cartPage, 
        cartPost,
        cartRemove,
        createOrder, 
        ordersPage } = require('../controllers/userController')

router.get('/', homePage)

router.get('/products', productsPage)
router.get(`/products/:id`, productPage)

router.get('/cart', is_auth, cartPage)
router.post('/cart', is_auth, cartPost)
router.post('/cart/remove', is_auth, cartRemove)

router.post('/create-order', is_auth, createOrder)
router.get('/orders', is_auth, ordersPage)

module.exports = { userRoutes: router }