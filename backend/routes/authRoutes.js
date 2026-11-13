const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { protect } = require("../middleware/authMiddleware");
const {
  signup, login, logout,
  getMyProfile, updateProfile, uploadProfilePhoto,
  getAllRoommates,
} = require("../controllers/authController");

// Public
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Private
router.get("/me", protect, getMyProfile);
router.put("/profile", protect, updateProfile);
router.post("/profile/photo", protect, upload.single("photo"), uploadProfilePhoto);
router.get("/roommates", protect, getAllRoommates);

module.exports = { router };
