// controllers/commentController.js

const { Comment } = require('../models');

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const blogPostId = req.params.blogPostId;

    // Create a new comment in the database
    await Comment.create({ content, blogPostId, userId: req.session.user.id });

    res.redirect(`/blogpost/${blogPostId}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create a new comment.' });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const blogPostId = req.params.blogPostId;

    // Delete the comment from the database
    await Comment.destroy({ where: { id: commentId } });

    res.redirect(`/blogpost/${blogPostId}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete the comment.' });
  }
};
