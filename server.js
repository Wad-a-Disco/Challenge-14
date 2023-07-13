// server.js

// Import dependencies
const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');
const { User, BlogPost, Comment } = require('./models');

// Create an Express application
const app = express();

// Configure session middleware
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
  })
);

// Set up body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Define routes

// Home route
app.get('/', async (req, res) => {
  try {
    // Retrieve existing blog posts from the database
    const blogPosts = await BlogPost.findAll();

    res.render('home', { blogPosts }); // Render the 'home' template and pass the retrieved blog posts as data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve blog posts.' });
  }
});

// Dashboard route
app.get('/dashboard', async (req, res) => {
  // Check if the user is authenticated
  if (!req.session.user) {
    // User not authenticated, redirect to login
    return res.redirect('/login');
  }

  try {
    // Retrieve the user's created blog posts from the database
    const userBlogPosts = await BlogPost.findAll({
      where: { userId: req.session.user.id },
    });

    res.render('dashboard', { userBlogPosts }); // Render the 'dashboard' template and pass the retrieved user's blog posts as data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve user blog posts.' });
  }
});

// Signup route
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user record in the database
    await User.create({ username, password: hashedPassword });

    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Signup failed. Please try again.' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Retrieve the user record from the database based on the provided username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      // User not found
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Password doesn't match
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If the passwords match, create a session for the user
    req.session.user = {
      id: user.id,
      username: user.username,
    };

    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// Logout route
app.get('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy();

  res.redirect('/');
});

// Blog post route
app.get('/blogposts/:id', async (req, res) => {
  try {
    const blogPostId = req.params.id;

    // Retrieve the blog post and its associated comments from the database
    const blogPost = await BlogPost.findByPk(blogPostId, {
      include: [{ model: Comment, include: [User] }],
    });

    res.render('post', { blogPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve the blog post.' });
  }
});

// Create a comment route
app.post('/comments', async (req, res) => {
  try {
    const { postId, content } = req.body;

    // Create a new comment in the database
    await Comment.create({
      content,
      userId: req.session.user.id,
      blogPostId: postId,
    });

    res.redirect(`/blogposts/${postId}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create a new comment.' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
