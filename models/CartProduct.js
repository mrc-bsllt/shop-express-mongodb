const Sequelize = require('sequelize')
const sequelize = require('../utils/database')

const CartProduct = sequelize.define('cart_product', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  quantity: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  }
})

module.exports = CartProduct