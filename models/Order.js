const Sequelize = require('sequelize')
const sequelize = require('../utils/database')

const Order = sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    allowNul: false,
    autoIncrement: true,
    primaryKey: true
  },
  total_price: {
    type: Sequelize.DOUBLE,
    allowNul: false,
  }
})

module.exports = Order