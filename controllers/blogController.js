// controllers/blogController.js

const { BlogPost, Comment, User } = require('../models');

// Get all blog posts
exports.getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.findAll({
      include: [{ model: User, attributes: ['username'] }],
    });
    res.render('home', { blogPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve blog posts.' });
  }
};

// Get a single blog post
exports.getBlogPost = async (req, res) => {
  try {
    const blogPostId = req.params.blogPostId;
    const blogPost = await BlogPost.findByPk(blogPostId, {
      include: [
        { model: User, attributes: ['username'] },
        { model: Comment, include: [{ model: User, attributes: ['username'] }] },
      ],
    });
    res.render('post', { blogPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve the blog post.' });
  }
};

// Create a new blog post
exports.createBlogPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Create a new blog post in the database
    await BlogPost.create({ title, content, userId: req.session.user.id });

    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create a new blog post.' });
  }
};

// Update a blog post
exports.updateBlogPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const blogPostId = req.params.blogPostId;

    // Update the blog post in the database
    await BlogPost.update({ title, content }, { where: { id: blogPostId } });

    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update the blog post.' });
  }
};

// Delete a blog post
exports.deleteBlogPost = async (req, res) => {
  try {
    const blogPostId = req.params.blogPostId;

    // Delete the blog post from the database
    await BlogPost.destroy({ where: { id: blogPostId } });

    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete the blog post.' });
  }
};
