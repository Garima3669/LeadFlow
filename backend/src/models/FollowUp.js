const mongoose = require("mongoose");

const followUpSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: [true, "Follow-up action is required"],
      trim: true,
      maxlength: 500,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "COMPLETED",
        "OVERDUE",
      ],
      default: "PENDING",
    },

    completedAt: {
      type: Date,
      default: null,
    },

    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

followUpSchema.index({
  assignedTo: 1,
  dueDate: 1,
});

followUpSchema.index({
  lead: 1,
});

module.exports = mongoose.model("FollowUp", followUpSchema);