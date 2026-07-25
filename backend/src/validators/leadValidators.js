const {
  body,
  query,
  param,
} = require("express-validator");


/*
==================================================
PUBLIC LEAD CREATION
==================================================
*/

const createLeadValidator = [

  body("name")
    .trim()
    .notEmpty()
    .withMessage(
      "Name is required"
    )
    .isLength({
      min: 2,
      max: 100,
    })
    .withMessage(
      "Name must be between 2 and 100 characters"
    ),

  body("email")
    .trim()
    .notEmpty()
    .withMessage(
      "Email is required"
    )
    .isEmail()
    .withMessage(
      "Please provide a valid email"
    )
    .normalizeEmail(),

  body("phone")
    .optional()
    .trim()
    .matches(
      /^[0-9+\-\s()]{7,20}$/
    )
    .withMessage(
      "Please provide a valid phone number"
    ),

  body("company")
    .optional()
    .trim()
    .isLength({
      max: 150,
    })
    .withMessage(
      "Company name is too long"
    ),

  body("message")
    .optional()
    .trim()
    .isLength({
      max: 2000,
    })
    .withMessage(
      "Message cannot exceed 2000 characters"
    ),

];


/*
==================================================
UPDATE LEAD
==================================================
*/

const updateLeadValidator = [

  param("id")
    .isMongoId()
    .withMessage(
      "Invalid lead ID"
    ),

  body("name")
    .optional()
    .trim()
    .isLength({
      min: 2,
      max: 100,
    })
    .withMessage(
      "Name must be between 2 and 100 characters"
    ),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage(
      "Please provide a valid email"
    )
    .normalizeEmail(),

  body("phone")
    .optional()
    .trim()
    .matches(
      /^[0-9+\-\s()]{7,20}$/
    )
    .withMessage(
      "Invalid phone number"
    ),

  body("status")
    .optional()
    .isIn([
      "NEW",
      "CONTACTED",
      "QUALIFIED",
      "PROPOSAL",
      "WON",
      "LOST",
    ])
    .withMessage(
      "Invalid lead status"
    ),

];


/*
==================================================
LEAD ID
==================================================
*/

const leadIdValidator = [

  param("id")
    .isMongoId()
    .withMessage(
      "Invalid lead ID"
    ),

];


/*
==================================================
ASSIGN LEAD
==================================================
*/

const assignLeadValidator = [

  param("id")
    .isMongoId()
    .withMessage(
      "Invalid lead ID"
    ),

  body("assignedTo")
    .isMongoId()
    .withMessage(
      "Valid member ID is required"
    ),

];


/*
==================================================
ADD NOTE
==================================================
*/

const addNoteValidator = [

  param("id")
    .isMongoId()
    .withMessage(
      "Invalid lead ID"
    ),

  body("content")
    .trim()
    .notEmpty()
    .withMessage(
      "Note content is required"
    )
    .isLength({
      min: 2,
      max: 2000,
    })
    .withMessage(
      "Note must be between 2 and 2000 characters"
    ),

];


/*
==================================================
CREATE FOLLOW-UP
==================================================
*/

const createFollowUpValidator = [

  param("id")
    .isMongoId()
    .withMessage(
      "Invalid lead ID"
    ),

  body("action")
    .trim()
    .notEmpty()
    .withMessage(
      "Follow-up action is required"
    )
    .isLength({
      min: 2,
      max: 500,
    })
    .withMessage(
      "Action must be between 2 and 500 characters"
    ),

  body("dueDate")
    .isISO8601()
    .withMessage(
      "Valid due date is required"
    ),

];


/*
==================================================
FOLLOW-UP ID
==================================================
*/

const completeFollowUpValidator = [

  param("id")
    .isMongoId()
    .withMessage(
      "Invalid lead ID"
    ),

  param("followUpId")
    .isMongoId()
    .withMessage(
      "Invalid follow-up ID"
    ),

];


module.exports = {

  createLeadValidator,

  updateLeadValidator,

  leadIdValidator,

  assignLeadValidator,

  addNoteValidator,

  createFollowUpValidator,

  completeFollowUpValidator,

};