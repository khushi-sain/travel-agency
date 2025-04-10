const User = require('../models/User');
const { createToken } = require('../config/jwt');

// User Registration
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check for missing fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // Create user
    const newUser = new User({ name, email, password }); // Password will be hashed via pre-save hook (see notes below)
    await newUser.save();

    const token = createToken(newUser);

    res.status(201).json({
      token,
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      redirect: "/home"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(user);

    res.status(200).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      },
      redirect: "/home"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
