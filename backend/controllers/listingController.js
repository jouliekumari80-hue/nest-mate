const Listing = require("../models/RoommateListings");
const cloudinary = require("cloudinary").v2;

// ─── Helper Functions ─────────────────────────────────────
// Helper to extract Cloudinary public ID safely from a URL
const getPublicIdFromUrl = (url) => {
  try {
    const parts = url.split("/");
    const filename = parts.pop();
    const folder = parts.slice(parts.indexOf("upload") + 2).join("/");
    const publicId = filename.split(".")[0];
    return folder ? `${folder}/${publicId}` : publicId;
  } catch {
    return null;
  }
};

// ─── Create Listing ───────────────────────────────────────
const createListing = async (req, res) => {
  try {
    const newListingData = {
      ...req.body,
      owner: req.user.id,
    };

    const listing = await Listing.create(newListingData);
    return res.status(201).json({ success: true, data: listing });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// ─── Get All Listings (Filtering & Pagination) ───────────
const getListings = async (req, res) => {
  try {
    const {
      city,
      area,
      propertyType,
      sharing,
      preferredGender,
      occupation,
      furnishing,
      foodAvailability,
      amenities,
      minRent,
      maxRent,
      minAge,
      maxAge,
      sort,
      status = "Active",
      page = 1,
      limit = 12,
    } = req.query;

    const query = { status };

    // String matchers (case-insensitive)
    if (city) query["location.city"] = new RegExp(city.trim(), "i");
    if (area) query["location.area"] = new RegExp(area.trim(), "i");

    // Exact match filters
    if (propertyType) query.propertyType = propertyType;
    if (sharing) query.sharingType = sharing;
    if (preferredGender) query.preferredGender = preferredGender;
    if (occupation) query.occupation = occupation;
    if (furnishing) query.furnishing = furnishing;
    if (foodAvailability) query.foodAvailability = foodAvailability;

    // Array filter
    if (amenities) {
      const amenityList = amenities.split(",").map((a) => a.trim());
      query.amenities = { $all: amenityList };
    }

    // Numerical range filters
    if (minRent || maxRent) {
      query.rentPerHead = {};
      if (minRent) query.rentPerHead.$gte = Number(minRent);
      if (maxRent) query.rentPerHead.$lte = Number(maxRent);
    }

    if (minAge || maxAge) {
      if (minAge) query["ageRange.min"] = { $gte: Number(minAge) };
      if (maxAge) query["ageRange.max"] = { $lte: Number(maxAge) };
    }

    // Sorting
    const sortOptions = {
      latest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      rent_low: { rentPerHead: 1 },
      rent_high: { rentPerHead: -1 },
    };
    const sortBy = sortOptions[sort] || { createdAt: -1 };

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Fetch data and count concurrently
    const [listings, totalCount] = await Promise.all([
      Listing.find(query)
        .populate("owner", "name email profilePhoto college course bio")
        .sort(sortBy)
        .skip(skip)
        .limit(limitNum),
      Listing.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      count: listings.length,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      data: listings,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Get Single Listing ───────────────────────────────────
const getListing = async (req, res) => {
  try {
    // Increment views and return updated document
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("owner", "name email profilePhoto college course bio");

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    // Fetch up to 4 similar active listings in the same city
    const similarListings = await Listing.find({
      _id: { $ne: listing._id },
      "location.city": listing.location.city,
      status: "Active",
    }).limit(4);

    return res.status(200).json({
      success: true,
      data: listing,
      similar: similarListings,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Get Current User's Listings ──────────────────────────
const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user.id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Update Listing ───────────────────────────────────────
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    // Ownership check
    const isOwner = listing.owner.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized to update this listing" });
    }

    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ success: true, data: updatedListing });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// ─── Delete Listing ───────────────────────────────────────
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    const isOwner = listing.owner.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this listing" });
    }

    // Cleanup images on Cloudinary if present
    if (listing.images && listing.images.length > 0) {
      const deletePromises = listing.images.map((url) => {
        const publicId = getPublicIdFromUrl(url);
        return publicId ? cloudinary.uploader.destroy(publicId) : Promise.resolve();
      });

      // Fire image deletions in parallel without letting individual failures block deletion
      await Promise.allSettled(deletePromises);
    }

    await listing.deleteOne();

    return res.status(200).json({ success: true, message: "Listing deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Upload Images ────────────────────────────────────────
const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "Please select at least one image" });
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    if (listing.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized to upload images for this listing" });
    }

    // Parallel upload using Promise.all for faster execution
    if (!process.env.CLOUDINARY_URL) {
      return res.status(500).json({ success: false, message: "Cloudinary is not configured. Add CLOUDINARY_URL to your environment." });
    }

    const uploadTasks = req.files.map((file) =>
      cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        { folder: "nestmate/listings" }
      )
    );

    const results = await Promise.all(uploadTasks);
    const uploadedUrls = results.map((result) => result.secure_url);

    listing.images.push(...uploadedUrls);
    await listing.save();

    return res.status(200).json({ success: true, data: uploadedUrls });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Toggle Listing Status ────────────────────────────────
const toggleStatus = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    // Authorization check
    const isOwner = listing.owner.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized to change listing status" });
    }

    const nextStatus = {
      Active: "Filled",
      Filled: "Closed",
      Closed: "Active",
    };

    listing.status = nextStatus[listing.status] || "Active";
    await listing.save();

    return res.status(200).json({ success: true, data: listing });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Find Matching Roommate Listings ─────────────────────
const matchRoommates = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    const matches = await Listing.find({
      _id: { $ne: listing._id },
      status: "Active",
      "location.city": listing.location.city,
      preferredGender: { $in: [listing.preferredGender, "Any"] },
    })
      .populate("owner", "name email profilePhoto college course bio")
      .limit(10);

    return res.status(200).json({
      success: true,
      count: matches.length,
      data: matches,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createListing,
  getListings,
  getListing,
  getMyListings,
  updateListing,
  deleteListing,
  uploadImages,
  toggleStatus,
  matchRoommates,
};