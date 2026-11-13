const mongoose = require("mongoose");

const RoommateListingSchema = new mongoose.Schema(
  {
    // ---------- Accommodation Details ----------
    propertyType: {
      type: String,
      enum: ["PG", "Flat", "Hostel"],
      required: true,
    },

    location: {
      city: {
        type: String,
        required: true,
        trim: true,
      },
      area: {
        type: String,
        required: true,
        trim: true,
      },
    },

    rentPerHead: {
      type: Number,
      required: true,
    },

    securityDeposit: {
      type: Number,
    },

    sharingType: {
      type: String,
      enum: ["Single", "Double", "Triple", "Four+"],
      required: true,
    },

    roommatesNeeded: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },

    moveInDate: {
      type: Date,
      required: true,
    },

    // ---------- Property Features ----------
    furnishing: {
      type: String,
      enum: ["Unfurnished", "Semi-furnished", "Fully-furnished"],
    },

    foodAvailability: {
      type: String,
      enum: [
        "Mess Included",
        "Self-Cooking",
        "Cook Available",
        "Not Available",
      ],
    },

    amenities: [
      {
        type: String,
        enum: [
          "WiFi",
          "AC",
          "Washing Machine",
          "Refrigerator",
          "Study Table",
          "Parking",
          "Lift",
          "Power Backup",
          "RO Water",
          "Geyser",
        ],
      },
    ],

    images: [
      {
        type: String,
      },
    ],

    // ---------- Roommate Preferences ----------
    preferredGender: {
      type: String,
      enum: ["Male", "Female", "Any"],
      required: true,
    },

    occupation: {
      type: String,
      enum: ["Student", "Working Professional", "Any"],
      required: true,
    },

    ageRange: {
      min: Number,
      max: Number,
    },

    roommatePreferences: {
      foodHabit: {
        type: String,
        enum: ["Veg", "Non-Veg", "Vegan", "Any"],
      },

      smoking: {
        type: String,
        enum: ["Yes", "No"],
      },

      drinking: {
        type: String,
        enum: ["Yes", "No"],
      },

      sleepSchedule: {
        type: String,
        enum: ["Early Bird", "Night Owl", "Flexible"],
      },

      cleanliness: {
        type: String,
        enum: ["Very Clean", "Moderate", "Doesn't Matter"],
      },
    },

    // ---------- Listing Details ----------
    description: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Active", "Filled", "Closed"],
      default: "Active",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("RoommateListing", RoommateListingSchema);
