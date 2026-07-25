const express = require("express");

const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  assignLead,
  deleteLead,
} = require("../controllers/leadController");

const {
  authenticate,
  authorize,
} = require("../middleware/authMiddleware");

const {
  addNote,
  getNotes,
  getActivities,
  createFollowUp,
  getFollowUps,
  completeFollowUp,
} = require("../controllers/interactionController");

const validate = require("../middleware/validationMiddleware");

const {
  createLeadValidator,
  updateLeadValidator,
  leadIdValidator,
  assignLeadValidator,
  addNoteValidator,
  createFollowUpValidator,
  completeFollowUpValidator,
} = require("../validators/leadValidators");

const router = express.Router();

/*
==================================================
PUBLIC LEAD CAPTURE
Anyone can submit a lead
==================================================
*/

router.post(
  "/public",
  createLeadValidator,
  validate,
  createLead
);

/*
==================================================
PROTECTED LEAD ROUTES
Admin + Member
==================================================
*/

// Get all leads
// Supports pagination, filtering and search
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "MEMBER"),
  getLeads
);


/*
==================================================
NOTES
Admin + Member
==================================================
*/

// Add note
router.post(
  "/:id/notes",
  authenticate,
  authorize("ADMIN", "MEMBER"),
  addNoteValidator,
  validate,
  addNote
);

// Get notes
router.get(
  "/:id/notes",
  authenticate,
  authorize("ADMIN", "MEMBER"),
  leadIdValidator,
  validate,
  getNotes
);


/*
==================================================
ACTIVITY TRAIL
Admin + Member
==================================================
*/

router.get(
  "/:id/activities",
  authenticate,
  authorize("ADMIN", "MEMBER"),
  leadIdValidator,
  validate,
  getActivities
);


/*
==================================================
FOLLOW-UPS
Admin + Member
==================================================
*/

// Create follow-up
router.post(
  "/:id/followups",
  authenticate,
  authorize("ADMIN", "MEMBER"),
  createFollowUpValidator,
  validate,
  createFollowUp
);

// Get follow-ups
router.get(
  "/:id/followups",
  authenticate,
  authorize("ADMIN", "MEMBER"),
  leadIdValidator,
  validate,
  getFollowUps
);

// Complete follow-up
router.patch(
  "/:id/followups/:followUpId",
  authenticate,
  authorize("ADMIN", "MEMBER"),
  completeFollowUpValidator,
  validate,
  completeFollowUp
);


/*
==================================================
SINGLE LEAD
Admin + Member
==================================================
*/

// Get single lead
router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "MEMBER"),
  leadIdValidator,
  validate,
  getLeadById
);

// Update lead
router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN", "MEMBER"),
  updateLeadValidator,
  validate,
  updateLead
);

/*
==================================================
ADMIN ONLY
==================================================
*/

// Assign lead
router.patch(
  "/:id/assign",
  authenticate,
  authorize("ADMIN"),
  assignLeadValidator,
  validate,
  assignLead
);

// Delete lead
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  leadIdValidator,
  validate,
  deleteLead
);

module.exports = router;