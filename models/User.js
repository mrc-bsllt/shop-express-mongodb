const mongodb = require('mongodb')
const { getDb } = require('../utils/database')
const ObjId = mongodb.ObjectId

class User {
  constructor(username, email, cart = null) {
    this.username = username
    this.email = email
    this.cart = cart ? cart : { products: [] }
  }

  save() {
    const db = getDb()
    return db.collection('users').insertOne(this)
  }

  static fetchUsers() {
    const db = getDb()
    return db.collection('users').find().toArray()
  }

  static getUserByEmail(email) {
    const db = getDb()
    return db.collection('users').findOne({ email })
  }

  static addToCart(user, prod_id) {
    const db = getDb()
    const product_id = new ObjId(prod_id)

    const cartProdIndex = user.cart.products.findIndex(prod => prod.product_id.toString() === product_id.toString())
    const quantity = cartProdIndex < 0 ? 1 : user.cart.products[cartProdIndex].quantity + 1
    
    let updatedCart
    if(cartProdIndex < 0) {
      updatedCart = { products: [ ...user.cart.products, { product_id, quantity }] }
    } else {
      user.cart.products[cartProdIndex].quantity = quantity
      updatedCart = { products: [ ...user.cart.products] }
    }
    
    return db.collection('users').updateOne({ _id: user._id }, {
      $set: { cart: updatedCart }
    })
  }
}

module.exports = User