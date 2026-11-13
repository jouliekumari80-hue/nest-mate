const mongoose = require("mongoose");

const savedListingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoommateListing",
      required: true,
    },
  },
  { timestamps: true }
);

savedListingSchema.index({ user: 1, listing: 1 }, { unique: true });
savedListingSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("SavedListing", savedListingSchema);
