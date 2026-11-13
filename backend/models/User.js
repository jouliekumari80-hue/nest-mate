const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },

    role: { type: String, enum: ["user", "admin"], default: "user" },
    verified: { type: Boolean, default: false },

    // ─── Profile Fields ──────────────────────────────────
    college: { type: String, trim: true },
    course: { type: String, trim: true },
    bio: { type: String, trim: true, maxlength: 500 },
    profilePhoto: { type: String, default: "" },

    foodHabit: { type: String, enum: ["Veg", "Non-Veg", "Vegan", "Any"] },
    sleepSchedule: { type: String, enum: ["Early Bird", "Night Owl", "Flexible"] },
    smoking: { type: String, enum: ["Yes", "No"] },
    drinking: { type: String, enum: ["Yes", "No"] },
    cleanliness: { type: String, enum: ["Very Clean", "Moderate", "Doesn't Matter"] },

    interests: [{ type: String, trim: true }],

    // ─── Computed ────────────────────────────────────────
    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
