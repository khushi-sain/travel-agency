const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || "tripzysecret";

const createToken = (user) => {
  return jwt.sign({ id: user._id }, secret, { expiresIn: "7d" });
};

const verifyToken = (token) => {
  return jwt.verify(token, secret);
};

module.exports = { createToken, verifyToken };
