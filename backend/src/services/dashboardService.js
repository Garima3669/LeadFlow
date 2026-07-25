const Lead = require("../models/Lead");
const Activity = require("../models/Activity");

/**
 * Get dashboard statistics
 */
const getDashboardStats = async (user) => {
  const filter = {};

  // Members can only see their assigned leads
  if (user.role === "MEMBER") {
    filter.assignedTo = user._id;
  }

  const [
    totalLeads,
    newLeads,
    contactedLeads,
    qualifiedLeads,
    wonLeads,
    lostLeads,
  ] = await Promise.all([
    Lead.countDocuments(filter),

    Lead.countDocuments({
      ...filter,
      status: "NEW",
    }),

    Lead.countDocuments({
      ...filter,
      status: "CONTACTED",
    }),

    Lead.countDocuments({
      ...filter,
      status: "QUALIFIED",
    }),

    Lead.countDocuments({
      ...filter,
      status: "WON",
    }),

    Lead.countDocuments({
      ...filter,
      status: "LOST",
    }),
  ]);

  return {
    totalLeads,
    newLeads,
    contactedLeads,
    qualifiedLeads,
    wonLeads,
    lostLeads,
  };
};


/**
 * Get recent activities
 */
const getRecentActivities = async (
  user,
  limit = 5
) => {
  const filter = {};

  // Members should only see activities
  // related to their assigned leads
  if (user.role === "MEMBER") {
    filter.assignedTo = user._id;
  }

  let query = Activity.find()
    .populate(
      "lead",
      "name company assignedTo"
    )
    .populate(
      "createdBy",
      "name email role"
    )
    .sort({
      createdAt: -1,
    })
    .limit(Number(limit));

  // For members, filter activities
  // after populating is not ideal.
  // We can first get assigned lead IDs.
  if (user.role === "MEMBER") {
    const assignedLeads =
      await Lead.find({
        assignedTo: user._id,
      }).select("_id");

    const leadIds =
      assignedLeads.map(
        (lead) => lead._id
      );

    query = Activity.find({
      lead: {
        $in: leadIds,
      },
    })
      .populate(
        "lead",
        "name company assignedTo"
      )
      .populate(
        "createdBy",
        "name email role"
      )
      .sort({
        createdAt: -1,
      })
      .limit(Number(limit));
  }

  return query;
};


module.exports = {
  getDashboardStats,
  getRecentActivities,
};