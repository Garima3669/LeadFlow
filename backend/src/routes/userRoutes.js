const express = require("express");

const {
  getMembers,
} = require("../controllers/userController");

const {
  authenticate,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/members",
  authenticate,
  authorize("ADMIN"),
  getMembers
);

module.exports = router;