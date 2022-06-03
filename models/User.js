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

  static getCartProducts(cart) {
    const db = getDb()
    const prod_ids = cart.products.map(prod => prod.product_id)

    return db.collection('products').find({ _id: { $in: prod_ids }}).toArray().then(products => {
      const updatedProduct = products.map(prod => {
        const quantity = cart.products.find(el => el.product_id.toString() === prod._id.toString()).quantity
        return { ...prod, quantity }
      })

      return updatedProduct
    }).catch(error => console.log(error))
  }

  static removeCartProduct(user, prod_id) {
    const db = getDb()
    const prodIdToRemove = new ObjId(prod_id)
    const updatedCart = user.cart.products.filter(el => el.product_id.toString() !== prodIdToRemove.toString())
    
    return db.collection('users').updateOne({ _id: new ObjId(user._id) }, { $set: { cart: { products: updatedCart }}})
  }
}

module.exports = User