const express = require("express");

const {
  authenticate,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Any authenticated user
router.get(
  "/protected",
  authenticate,
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "You are authenticated",
      user: {
        id: req.user._id,
        name: req.user.name,
        role: req.user.role,
      },
    });
  }
);

// Admin only
router.get(
  "/admin-only",
  authenticate,
  authorize("ADMIN"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Welcome Admin! You have access.",
    });
  }
);

// Admin OR Member
router.get(
  "/team",
  authenticate,
  authorize(
    "ADMIN",
    "MEMBER"
  ),
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Welcome to the team area.",
    });
  }
);

module.exports = router;