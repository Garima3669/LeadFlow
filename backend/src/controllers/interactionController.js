const noteService = require("../services/noteService");

const followUpService = require("../services/followUpService");

const {
  getLeadActivities,
} = require("../services/activityService");

const Lead = require("../models/Lead");

/**
 * Check whether user can access a lead
 */
const checkLeadAccess = async (
  leadId,
  user
) => {
  const lead =
    await Lead.findById(leadId);

  if (!lead) {
    const error = new Error(
      "Lead not found"
    );

    error.statusCode = 404;

    throw error;
  }

  /*
  ADMIN
  Can access all leads
  */
  if (user.role === "ADMIN") {
    return lead;
  }

  /*
  MEMBER
  Can only access assigned leads
  */
  if (
    user.role === "MEMBER" &&
    (
      !lead.assignedTo ||
      lead.assignedTo.toString() !==
        user._id.toString()
    )
  ) {
    const error = new Error(
      "You do not have access to this lead"
    );

    error.statusCode = 403;

    throw error;
  }

  return lead;
};


/**
 * Add Note
 */
const addNote = async (
  req,
  res,
  next
) => {
  try {

    const {
      content,
    } = req.body;

    /*
    Check lead permission
    */
    await checkLeadAccess(
      req.params.id,
      req.user
    );

    const note =
      await noteService.addNote({
        leadId:
          req.params.id,

        content,

        user:
          req.user,
      });

    res.status(201).json({

      success: true,

      message:
        "Note added successfully",

      data: note,

    });

  } catch (error) {

    next(error);

  }
};


/**
 * Get Notes
 */
const getNotes = async (
  req,
  res,
  next
) => {
  try {

    /*
    Check lead permission
    */
    await checkLeadAccess(
      req.params.id,
      req.user
    );

    const notes =
      await noteService.getLeadNotes(
        req.params.id
      );

    res.status(200).json({

      success: true,

      data: notes,

    });

  } catch (error) {

    next(error);

  }
};


/**
 * Get Activities
 */
const getActivities = async (
  req,
  res,
  next
) => {
  try {

    /*
    Check lead permission
    */
    await checkLeadAccess(
      req.params.id,
      req.user
    );

    const activities =
      await getLeadActivities(
        req.params.id
      );

    res.status(200).json({

      success: true,

      data: activities,

    });

  } catch (error) {

    next(error);

  }
};


/**
 * Create Follow-up
 */
const createFollowUp = async (
  req,
  res,
  next
) => {
  try {

    const {
      action,
      dueDate,
    } = req.body;

    /*
    Check lead permission
    */
    await checkLeadAccess(
      req.params.id,
      req.user
    );

    const followUp =
      await followUpService.createFollowUp({

        leadId:
          req.params.id,

        action,

        dueDate,

        user:
          req.user,

      });

    res.status(201).json({

      success: true,

      message:
        "Follow-up created successfully",

      data: followUp,

    });

  } catch (error) {

    next(error);

  }
};


/**
 * Get Follow-ups
 */
const getFollowUps = async (
  req,
  res,
  next
) => {
  try {

    /*
    Check lead permission
    */
    await checkLeadAccess(
      req.params.id,
      req.user
    );

    const followUps =
      await followUpService.getLeadFollowUps(
        req.params.id
      );

    res.status(200).json({

      success: true,

      data: followUps,

    });

  } catch (error) {

    next(error);

  }
};


/**
 * Complete Follow-up
 */
const completeFollowUp = async (
  req,
  res,
  next
) => {
  try {

    /*
    Check lead permission
    */
    await checkLeadAccess(
      req.params.id,
      req.user
    );

    const followUp =
      await followUpService.completeFollowUp({

        leadId:
          req.params.id,

        followUpId:
          req.params.followUpId,

        user:
          req.user,

      });

    res.status(200).json({

      success: true,

      message:
        "Follow-up completed",

      data: followUp,

    });

  } catch (error) {

    next(error);

  }
};


module.exports = {

  addNote,

  getNotes,

  getActivities,

  createFollowUp,

  getFollowUps,

  completeFollowUp,

};