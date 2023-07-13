// controllers/authController.js

const bcrypt = require('bcrypt');
const { User } = require('../models');

// Signup route handler
exports.signup = async (req, res) => {
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
};

// Login route handler
exports.login = async (req, res) => {
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
};
