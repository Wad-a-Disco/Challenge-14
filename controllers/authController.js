// authController.js

const bcrypt = require('bcrypt');
const { User } = require('../models');

// Handle POST request to /signup
const signup = async (req, res) => {
  try {
    // Retrieve the username and password from the request body
    const { username, password } = req.body;

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user record in the database
    await User.create({ username, password: hashedPassword });

    // Redirect the user to the login page or any other appropriate page
    res.redirect('/login');
  } catch (error) {
    // Handle any errors that occur during signup
    console.error(error);
    res.status(500).json({ message: 'Signup failed. Please try again.' });
  }
};

// Handle POST request to /login
const login = async (req, res) => {
  try {
    // Retrieve the username and password from the request body
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

    // Redirect the user to the dashboard or any other appropriate page
    res.redirect('/dashboard');
  } catch (error) {
    // Handle any errors that occur during login
    console.error(error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

module.exports = {
  signup,
  login,
};
