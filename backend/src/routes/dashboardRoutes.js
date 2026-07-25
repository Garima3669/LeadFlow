const express = require("express");

const {
  getDashboardStats,
    getRecentActivities,
} = require(
  "../controllers/dashboardController"
);

const {
  authenticate,
  authorize,
} = require(
  "../middleware/authMiddleware"
);

const router =
  express.Router();

router.get(
  "/stats",
  authenticate,
  authorize(
    "ADMIN",
    "MEMBER"
  ),
  getDashboardStats
);

router.get(
  "/activities",
  authenticate,
  authorize("ADMIN", "MEMBER"),
  getRecentActivities
);

module.exports = router;