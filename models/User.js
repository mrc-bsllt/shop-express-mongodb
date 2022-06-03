const mongodb = require('mongodb')
const { getDb } = require('../utils/database')

class User {
  constructor(username, email) {
    this.username = username
    this.email = email
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
}

module.exports = User