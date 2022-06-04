const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: [{
    product_id: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }]
})

userSchema.methods.addToCart = function(product) {
  const cartProdIndex = this.cart.findIndex(prod => prod.product_id.toString() === product._id.toString())
  const quantity = cartProdIndex < 0 ? 1 : this.cart[cartProdIndex].quantity + 1

  if(cartProdIndex < 0) {
    this.cart = [ ...this.cart, { product_id: product, quantity }]
  } else {
    this.cart[cartProdIndex].quantity = quantity
    this.cart = [ ...this.cart]
  }

  return this.save()
}

userSchema.methods.removeToCart = function(product) {
  const updatedCart = this.cart.filter(prod => prod.product_id.toString() !== product._id.toString())
  this.cart = updatedCart

  return this.save()
}

userSchema.methods.resetCart = function() {
  this.cart = []
  return this.save()
}

module.exports = mongoose.model('User', userSchema)