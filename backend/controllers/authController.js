const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper: Generate token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already used' });

    const user = await User.create({ name, email, password });

    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true });

    res.status(201).json({
      message: 'User registered',
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Register failed', error: err.message });
  }
};

// Login existing user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true });

    res.json({
      message: 'Login successful',
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Logout: clear token cookie
const logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};

// Export all
module.exports = {
  register,
  login,
  logout
};
