// controllers/dashboardController.js

const { BlogPost } = require('../models');

// Get all blog posts created by the logged-in user
exports.getUserBlogPosts = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const blogPosts = await BlogPost.findAll({ where: { userId } });
    res.render('dashboard', { blogPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve user blog posts.' });
  }
};
