const Sequelize = require('sequelize')
const sequelize = require('../utils/database')

const OrderProduct = sequelize.define('order_product', {
  id: {
    type: Sequelize.INTEGER,
    allowNul: false,
    autoIncrement: true,
    primaryKey: true
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNul: false,
  }
})

module.exports = OrderProduct