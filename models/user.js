// models/User.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Comment = require('./Comment');

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
  }
);

// Define associations
User.hasMany(Comment);
Comment.belongsTo(User);

module.exports = User;
