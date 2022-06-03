const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://mrc-bsllt:marcodevelon@cluster0.niomo.mongodb.net/shop?retryWrites=true&w=majority')
    .then(client => {
      _db = client.db()
      callback()
    }).catch(error => {
      console.log(error)
      throw error
    })
}

const getDb = () => {
  if(_db) return _db

  throw 'No database found'
}

module.exports = { mongoConnect, getDb }