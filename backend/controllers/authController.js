const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      message: "User created successfully",
      token,
      user: { _id: user._id, name: user.name, email: user.email, profileCompleted: false },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error creating user", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileCompleted: user.profileCompleted,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

const logout = async (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};

const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ─── Update Profile (all fields) ─────────────────────────
const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "college", "course", "bio",
      "foodHabit", "sleepSchedule", "smoking", "drinking", "cleanliness",
      "interests",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // Mark profile as completed if key fields are filled
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    Object.assign(user, updates);

    // Auto-mark completion
    const required = ["college", "course", "foodHabit", "sleepSchedule", "smoking", "drinking", "cleanliness"];
    user.profileCompleted = required.every((f) => user[f] && user[f] !== "");

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");
    return res.status(200).json({ message: "Profile updated", data: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

// ─── Upload Profile Photo ────────────────────────────────
const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!process.env.CLOUDINARY_URL) {
      return res.status(500).json({ message: "Cloudinary is not configured. Add CLOUDINARY_URL to your environment." });
    }

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "nestmate/profiles",
        width: 300,
        height: 300,
        crop: "fill",
      }
    );

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePhoto: result.secure_url },
      { new: true }
    ).select("-password");

    return res.status(200).json({ message: "Profile photo updated", data: user });
  } catch (error) {
    return res.status(500).json({ message: "Error uploading photo", error: error.message });
  }
};

// ─── Get All Roommates ───────────────────────────────────
const getAllRoommates = async (req, res) => {
  try {
    const allUsers = await User.find({ _id: { $ne: req.user._id } }).select("-password");
    return res.status(200).json(allUsers);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  signup,
  login,
  logout,
  getMyProfile,
  updateProfile,
  uploadProfilePhoto,
  getAllRoommates,
};
