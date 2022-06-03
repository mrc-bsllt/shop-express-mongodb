const Sequelize = require('sequelize')

const sequelize = new Sequelize('shop-express', 'root', 'marcodevelon', {
  dialect: 'mysql',
  host: 'localhost'
})

module.exports = sequelize