const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    company: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    message: {
      type: String,
      maxlength: 2000,
    },

    status: {
      type: String,
      enum: [
        "NEW",
        "CONTACTED",
        "QUALIFIED",
        "PROPOSAL",
        "WON",
        "LOST",
      ],
      default: "NEW",
    },

    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    temperature: {
      type: String,
      enum: ["HOT", "WARM", "COLD"],
      default: "COLD",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ status: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ score: -1 });

module.exports = mongoose.model("Lead", leadSchema);