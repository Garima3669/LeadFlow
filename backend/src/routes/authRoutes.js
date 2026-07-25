const express = require("express");

const {
  register,
  login,
  getMe,
} = require("../controllers/authController");

const {
  authenticate,
} = require("../middleware/authMiddleware");

const validate = require("../middleware/validationMiddleware");

const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidators");

const router = express.Router();

// Public routes
router.post(
  "/register",
  registerValidator,
  validate,
  register
);

router.post(
  "/login",
  loginValidator,
  validate,
  login
);

// Protected route
router.get(
  "/me",
  authenticate,
  getMe
);

module.exports = router;