// server.js

const express = require('express');
const session = require('express-session');
const path = require('path');
const { User } = require('./models');

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

// Define routes

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Tech Blog!');
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

// Dashboard route
app.get('/dashboard', (req, res) => {
  // Check if the user is authenticated
  if (!req.session.user) {
    // User not authenticated, redirect to login
    return res.redirect('/login');
  }

  res.send('Dashboard');
});

// Logout route
app.get('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy();

  res.redirect('/');
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
