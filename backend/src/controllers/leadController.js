const leadService = require("../services/leadService");

/**
 * Public lead capture
 */
const createLead = async (req, res, next) => {
  try {
    const lead = await leadService.createLead(
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Lead submitted successfully",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Get all leads
 */
const getLeads = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      assignedTo,
      search,
    } = req.query;

    const result =
      await leadService.getLeads({
        page,
        limit,
        status,
        assignedTo,
        search,
        user: req.user,
      });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Get single lead
 */
const getLeadById = async (req, res, next) => {
  try {
    const lead =
      await leadService.getLeadById(
        req.params.id,
        req.user
      );

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Update lead
 */
const updateLead = async (req, res, next) => {
  try {
    const lead =
      await leadService.updateLead(
        req.params.id,
        req.body,
        req.user
      );

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Assign lead
 */
const assignLead = async (req, res, next) => {
  try {
    const {
      assignedTo,
    } = req.body;

    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message: "assignedTo is required",
      });
    }

    const lead =
      await leadService.assignLead(
        req.params.id,
        assignedTo,
        req.user
      );

    res.status(200).json({
      success: true,
      message: "Lead assigned successfully",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Delete lead
 */
const deleteLead = async (req, res, next) => {
  try {
    await leadService.deleteLead(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  assignLead,
  deleteLead,
};