const mongodb = require('mongodb')
const { getDb } = require('../utils/database')
const ObjId = mongodb.ObjectId

class Order {
  constructor(user_id, products, total_value) {
    this.user_id = user_id
    this.products = products
    this.total_value = total_value
  }

  save() {
    const db = getDb()
    return db.collection('orders').insertOne(this)
  }

  static getOrders(user_id) {
    const db = getDb()

    return db.collection('orders').find({ user_id: new ObjId(user_id) }).toArray()
  }
}

module.exports = Order