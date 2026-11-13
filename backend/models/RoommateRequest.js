const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoommateListing",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled"],
      default: "pending",
    },
    message: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    contact: {
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

requestSchema.index({ sender: 1, status: 1 });
requestSchema.index({ receiver: 1, status: 1 });
requestSchema.index({ listing: 1 });

module.exports = mongoose.model("RoommateRequest", requestSchema);
