const FollowUp = require("../models/FollowUp");

const {
  createActivity,
} = require("./activityService");

const createFollowUp = async ({
  leadId,
  action,
  dueDate,
  user,
}) => {
  const followUp =
    await FollowUp.create({
      lead: leadId,
      action,
      dueDate,
      assignedTo: user._id,
    });

  await createActivity({
    type: "FOLLOW_UP_CREATED",
    description:
      `${user.name} created a follow-up`,
    lead: leadId,
    createdBy: user._id,
    metadata: {
      action,
      dueDate,
    },
  });

  return followUp;
};

const getLeadFollowUps = async (
  leadId
) => {
  return FollowUp.find({
    lead: leadId,
  })
    .populate(
      "assignedTo",
      "name email role"
    )
    .sort({
      dueDate: 1,
    });
};

const completeFollowUp = async ({
  leadId,
  followUpId,
  user,
}) => {
  const followUp =
    await FollowUp.findOne({
      _id: followUpId,
      lead: leadId,
    });

  if (!followUp) {
    const error = new Error(
      "Follow-up not found"
    );

    error.statusCode = 404;

    throw error;
  }

  // Only assigned member or admin
  if (
    user.role === "MEMBER" &&
    followUp.assignedTo.toString() !==
      user._id.toString()
  ) {
    const error = new Error(
      "You cannot complete this follow-up"
    );

    error.statusCode = 403;

    throw error;
  }

  followUp.status = "COMPLETED";
  followUp.completedAt =
    new Date();

  await followUp.save();

  await createActivity({
    type:
      "FOLLOW_UP_COMPLETED",
    description:
      `${user.name} completed a follow-up`,
    lead: leadId,
    createdBy: user._id,
  });

  return followUp;
};

module.exports = {
  createFollowUp,
  getLeadFollowUps,
  completeFollowUp,
};