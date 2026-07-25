const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "LEAD_CREATED",
        "LEAD_UPDATED",
        "STATUS_CHANGED",
        "ASSIGNED",
        "NOTE_ADDED",
        "FOLLOW_UP_CREATED",
        "FOLLOW_UP_COMPLETED",
      ],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.index({
  lead: 1,
  createdAt: -1,
});

module.exports = mongoose.model("Activity", activitySchema);