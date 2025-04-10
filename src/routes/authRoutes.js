// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registration Route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: 'User already exists' });

  // ❌ Don't hash manually here
  const newUser = new User({ name, email, password });
  await newUser.save(); // password will be hashed automatically by the model

  // ✅ Create token
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || 'secretkey', {
    expiresIn: '1h'
  });

  res.status(201).json({ message: 'User registered successfully', token });
});

 
// ✅ Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(' Login attempt:', { email });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(' Password mismatch');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretkey', {
      expiresIn: '1h',
    });

    console.log(' Login success');
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { name: user.name, email: user.email, id: user._id },
    });
  } catch (err) {
    console.error(' Login Error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
