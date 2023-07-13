// config/connection.js

const Sequelize = require('sequelize');

// Create a new Sequelize instance and configure the database connection
const sequelize = new Sequelize('your-database-name', 'your-username', 'your-password', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
