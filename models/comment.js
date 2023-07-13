// models/Comment.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const BlogPost = require('./blogPost');

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Comment',
  }
);

// Define associations
Comment.belongsTo(User);
Comment.belongsTo(BlogPost);
User.hasMany(Comment);
BlogPost.hasMany(Comment);

module.exports = Comment;
