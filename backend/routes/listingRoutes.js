const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/admin");
const Listing = require("../models/RoommateListings");

const {
  createListing,
  getListings,
  getListing,
  getMyListings,
  updateListing,
  deleteListing,
  uploadImages,
  toggleStatus,
  matchRoommates,
} = require("../controllers/listingController");

// ─── Public ───────────────────────────────────────────────
router.get("/", getListings);
router.get("/me/all", protect, getMyListings);
router.get("/:id", getListing);

// ─── Protected ────────────────────────────────────────────
router.post("/", protect, createListing);
router.put("/:id", protect, updateListing);
router.delete("/:id", protect, deleteListing);
router.post("/:id/images", protect, upload.array("images", 10), uploadImages);
router.patch("/:id/status", protect, toggleStatus);
router.get("/:id/matches", protect, matchRoommates);

// ─── Admin only ───────────────────────────────────────────
router.patch("/:id/verify", protect, admin, async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { isVerified: req.body.verified },
      { new: true }
    );
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }
    res.json({ success: true, data: listing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
