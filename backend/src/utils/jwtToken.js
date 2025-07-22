require('dotenv').config()
const formatUserData = require("./returnFormats/userData.js");

const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("./errors");

const generateToken = (payload, expiresIn = process.env.JWT_EXPIRES_TIME || "7d") => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired token");
  }
};

const sendToken = async (user, res, message, statusCode) => {
  // create Jwt token
  const token = await user.generateAuthToken();

  res
    .status(statusCode)
    .json({
      success: true,
      token,
      user: formatUserData(user),
      message: message,
    });
};

module.exports = {
  generateToken,
  verifyToken,
  sendToken,
};
