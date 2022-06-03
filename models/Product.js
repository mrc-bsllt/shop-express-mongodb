const mongodb = require('mongodb')
const { getDb } = require('../utils/database')
const ObjId = mongodb.ObjectId

class Product {
  constructor(title, price, image_url, description) {
    this.title = title
    this.price = typeof price === 'string' ? +price : price
    this.image_url = image_url
    this.description = description
  }

  save() {
    const db = getDb()
    return db.collection('products').insertOne(this).then(result => {
        console.log(result)
      }).catch(error => console.log(error))
  }

  update(id) {
    const db = getDb()
    return db.collection('products').updateOne({ _id: new ObjId(id) }, { $set: this })
  }

  static fetchAll() {
    const db = getDb()
    return db.collection('products').find().toArray().then(products => {
      return products
    }).catch(error => console.log(error))
  }

  static getProductById(id) {
    const db = getDb()
    return db.collection('products').find({ _id: new ObjId(id) }).next().then(product => {
      return product
    }).catch(error => console.log(error))
  }

  static deleteById(id) {
    const db = getDb()
    return db.collection('products').deleteOne({ _id: new ObjId(id) })
  }
}

module.exports = Product