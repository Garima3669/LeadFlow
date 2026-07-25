const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Note content is required"],
      trim: true,
      maxlength: 2000,
    },

    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.index({
  lead: 1,
  createdAt: -1,
});

module.exports = mongoose.model("Note", noteSchema);