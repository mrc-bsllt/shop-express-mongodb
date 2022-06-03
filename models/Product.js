const mongodb = require('mongodb')
const { getDb } = require('../utils/database')
const ObjId = mongodb.ObjectId

const User = require('./User')

class Product {
  constructor(title, price, image_url, description, user_id = null) {
    this.title = title
    this.price = typeof price === 'string' ? +price : price
    this.image_url = image_url
    this.description = description
    this.user_id = user_id
  }

  save() {
    const db = getDb()
    return db.collection('products').insertOne(this)
  }

  update(id) {
    const db = getDb()
    return db.collection('products').updateOne({ _id: new ObjId(id) }, { $set: this })
  }

  static fetchAll() {
    const db = getDb()
    return db.collection('products').find().toArray()
  }

  static getProductById(id) {
    const db = getDb()
    return db.collection('products').findOne({ _id: new ObjId(id) })
  }

  static deleteById(prod_id, user_cart) {
    const db = getDb()
    const product_id = new ObjId(prod_id)
    const isInCart = user_cart.products.findIndex(prod => prod.product_id.toString() === product_id.toString()) > 0

    if(isInCart) {
      User.removeCartProduct(prod_id).then(() => {
        return db.collection('products').deleteOne({ _id: product_id })
      }).catch(error => console.log(error))
    } else {
      return db.collection('products').deleteOne({ _id: product_id })
    }
  }
}

module.exports = Product