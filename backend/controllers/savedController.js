const SavedListing = require("../models/SavedListing");
const Listing = require("../models/RoommateListings");

// ─── Toggle Save / Unsave  ─────────────────────────────────
const toggleSave = async (req, res) => {
  try {
    const { listingId } = req.params;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    const existing = await SavedListing.findOne({
      user: req.user.id,
      listing: listingId,
    });

    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({ success: true, saved: false, message: "Listing unsaved" });
    }

    await SavedListing.create({ user: req.user.id, listing: listingId });
    return res.status(201).json({ success: true, saved: true, message: "Listing saved" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Get Saved Listings ────────────────────────────────────
const getSavedListings = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [saved, total] = await Promise.all([
      SavedListing.find({ user: req.user.id })
        .populate({
          path: "listing",
          populate: { path: "owner", select: "name email profilePhoto college course bio" },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      SavedListing.countDocuments({ user: req.user.id }),
    ]);

    const listings = saved.map((s) => s.listing).filter(Boolean);

    return res.status(200).json({
      success: true,
      count: listings.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: listings,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Check if listing is saved (for UI heart icon) ────────
const checkSaved = async (req, res) => {
  try {
    const { listingId } = req.params;
    const saved = await SavedListing.findOne({ user: req.user.id, listing: listingId });
    return res.status(200).json({ success: true, saved: !!saved });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { toggleSave, getSavedListings, checkSaved };
