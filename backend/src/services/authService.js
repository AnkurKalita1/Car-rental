const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const generateToken = (user) =>
  jwt.sign(
    { id: user._id.toString(), role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

const register = async (payload) => {
  const exists = await User.findOne({ email: payload.email });
  if (exists) {
    throw new ApiError(409, "Email already registered");
  }

  const user = await User.create(payload);
  const token = generateToken(user);
  return { user: sanitizeUser(user), token };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const match = await user.comparePassword(password);
  if (!match) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = generateToken(user);
  return { user: sanitizeUser(user), token };
};

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar || null
});

module.exports = {
  register,
  login
};
