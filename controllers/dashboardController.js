// controllers/dashboardController.js

const { BlogPost, Comment } = require('../models');

// Get all blog posts for the current user
exports.getAllUserBlogPosts = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const blogPosts = await BlogPost.findAll({
      where: { userId },
      include: [{ model: Comment }],
    });
    res.render('dashboard', { blogPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve user blog posts.' });
  }
};
