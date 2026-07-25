const Activity = require("../models/Activity");

const createActivity = async ({
  type,
  description,
  lead,
  createdBy = null,
  metadata = null,
}) => {
  return Activity.create({
    type,
    description,
    lead,
    createdBy,
    metadata,
  });
};

const getLeadActivities = async (leadId) => {
  return Activity.find({
    lead: leadId,
  })
    .populate(
      "createdBy",
      "name email role"
    )
    .sort({
      createdAt: -1,
    });
};

module.exports = {
  createActivity,
  getLeadActivities,
};