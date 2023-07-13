// config/connection.js

const Sequelize = require('sequelize');

// Create a new Sequelize instance and configure the database connection
const sequelize = new Sequelize('your-database-name', 'Wad-a-Disco', 'VoliantCobra75#@', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
