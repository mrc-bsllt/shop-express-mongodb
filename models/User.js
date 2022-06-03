const Sequelize = require('sequelize')
const sequelize = require('../utils/database')

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    allowNul: false,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING(20),
    allowNul: false
  },
  email: {
    type: Sequelize.STRING(20),
    allowNul: false
  }
})

module.exports = User