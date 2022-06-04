const mongoose = require('moongose')
const Schema = moongose.Schema

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

module.exports = moongose.model('Product', productSchema)