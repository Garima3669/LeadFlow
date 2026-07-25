const bcrypt = require("bcryptjs");

const User = require("../models/User");

const generateToken = require("../utils/generateToken");


/*
==================================================
REGISTER
Public registration
Always creates MEMBER
==================================================
*/

const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    // Validate name
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    // Validate email
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Validate password
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // Password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    // Email format
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid email address",
      });
    }

    // Check existing user
    const existingUser =
      await User.findOne({
        email: email.toLowerCase().trim(),
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }

    // Hash password
    const passwordHash =
      await bcrypt.hash(
        password,
        12
      );

    // Always create MEMBER
    const user =
      await User.create({
        name: name.trim(),

        email:
          email.toLowerCase().trim(),

        passwordHash,

        role: "MEMBER",
      });

    const token =
      generateToken(user);

    return res.status(201).json({
      success: true,

      message:
        "Registration successful",

      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },

        token,
      },
    });

  } catch (error) {

    console.error(
      "REGISTER ERROR:",
      error
    );

    next(error);
  }
};


/*
==================================================
LOGIN
==================================================
*/

const login = async (
  req,
  res,
  next
) => {

  try {

    const {
      email,
      password,
    } = req.body;


    /*
    Find user

    passwordHash has select:false
    so explicitly select it
    */

    const user =
      await User.findOne({
        email,
      }).select(
        "+passwordHash"
      );


    /*
    Don't reveal whether
    email exists
    */

    if (!user) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid email or password",

      });

    }


    /*
    Compare password
    */

    const isPasswordValid =
      await bcrypt.compare(

        password,

        user.passwordHash

      );


    if (!isPasswordValid) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid email or password",

      });

    }


    /*
    Generate JWT
    */

    const token =
      generateToken(user);


    /*
    Send response
    */

    return res.status(200).json({

      success: true,

      message:
        "Login successful",

      data: {

        user: {

          id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,

        },

        token,

      },

    });

  } catch (error) {

    next(error);

  }

};


/*
==================================================
GET CURRENT USER
Protected route
==================================================
*/

const getMe = async (
  req,
  res,
  next
) => {

  try {

    return res.status(200).json({

      success: true,

      data: {

        id:
          req.user._id,

        name:
          req.user.name,

        email:
          req.user.email,

        role:
          req.user.role,

      },

    });

  } catch (error) {

    next(error);

  }

};


module.exports = {

  register,

  login,

  getMe,

};