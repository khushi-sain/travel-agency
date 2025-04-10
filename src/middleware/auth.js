const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect('/');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.redirect('/');
    req.user = user;
    next();
  } catch (err) {
    res.redirect('/');
  }
};