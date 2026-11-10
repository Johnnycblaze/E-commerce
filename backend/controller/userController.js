const userModel = require("../model/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. User Sign Up
const userSignUpController = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email) throw new Error("Please provide email");
    if (!password) throw new Error("Please provide password");
    if (!name) throw new Error("Please provide name");

    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists with this email.",
        error: true,
        success: false
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    if (!hashPassword) throw new Error("Something went wrong hashing password");

    const payload = {
      ...req.body,
      role: "GENERAL",
      password: hashPassword
    };

    const userData = new userModel(payload);
    const saveUser = await userData.save();

    return res.status(201).json({
      data: saveUser,
      success: true,
      error: false,
      message: "User created successfully!"
    });
  } catch (err) {
    // Print exact error to your terminal console for instant diagnosis
    console.error("SIGNUP BACKEND ERROR:", err);
    return res.status(500).json({
      message: err.message || err,
      error: true,
      success: false
    });
  }
};

// 2. User Sign In
const userSignInController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) throw new Error("Please provide email");
    if (!password) throw new Error("Please provide password");

    const user = await userModel.findOne({ email });
    if (!user) throw new Error("User not found");

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) throw new Error("Check your password");

    const tokenData = {
      _id: user._id,
      email: user.email,
    };

    const secretKey = process.env.TOKEN_SECRET_KEY || "fallback_super_secret_key_123";
    const token = await jwt.sign(tokenData, secretKey, { expiresIn: '8h' });

    const tokenOption = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    };

    return res.cookie("token", token, tokenOption).status(200).json({
      message: "Login successfully",
      data: token,
      success: true,
      error: false
    });
  } catch (err) {
    console.error("SIGNIN BACKEND ERROR:", err);
    return res.status(500).json({
      message: err.message || err,
      error: true,
      success: false
    });
  }
};

// 3. User Details
const userRouterDetails = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    return res.status(200).json({
      data: user,
      error: false,
      success: true,
      message: "User details"
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      error: true,
      success: false
    });
  }
};

// 4. User Logout
const userLogout = async (req, res) => {
  try {
    return res.clearCookie("token").status(200).json({
      message: "Logged out successfully",
      error: false,
      success: true,
      data: []
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      error: true,
      success: false
    });
  }
};

// 5. Get All Users (Admin)
const allUsersController = async (req, res) => {
  try {
    const users = await userModel.find();
    return res.status(200).json({
      message: "All users fetched successfully",
      data: users,
      success: true,
      error: false
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      error: true,
      success: false
    });
  }
};

module.exports = {
  userSignUpController,
  userSignInController,
  userRouterDetails,
  userLogout,
  allUsersController
};