const Request = require("../models/RoommateRequest");
const Listing = require("../models/RoommateListings");

// ─── Send Request ──────────────────────────────────────────
const sendRequest = async (req, res) => {
  try {
    const { listingId, message, contact } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }
    if (listing.status !== "Active") {
      return res.status(400).json({ success: false, message: "This listing is no longer accepting requests" });
    }
    if (listing.roommatesNeeded <= 0) {
      return res.status(400).json({ success: false, message: "All spots are already filled" });
    }

    const receiverId = listing.owner.toString();
    if (receiverId === req.user.id) {
      return res.status(400).json({ success: false, message: "Cannot send request to your own listing" });
    }

    const existing = await Request.findOne({
      sender: req.user.id,
      listing: listingId,
      status: "pending",
    });
    if (existing) {
      return res.status(400).json({ success: false, message: "Request already sent" });
    }

    const hasContact = contact && (contact.email || contact.phone);
    const request = await Request.create({
      sender: req.user.id,
      receiver: receiverId,
      listing: listingId,
      message: message || "",
      contact: hasContact
        ? { email: contact.email || undefined, phone: contact.phone || undefined }
        : undefined,
    });

    const populated = await Request.findById(request._id)
      .populate("sender", "name email profilePhoto")
      .populate("listing", "location.city rentPerHead sharingType");

    return res.status(201).json({ success: true, data: populated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Get Requests Received ─────────────────────────────────
const getReceivedRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { receiver: req.user.id };
    if (status) filter.status = status;

    const requests = await Request.find(filter)
      .populate("sender", "name email profilePhoto college course")
      .populate("listing", "location.city rentPerHead sharingType propertyType")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Get Requests Sent ─────────────────────────────────────
const getSentRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { sender: req.user.id };
    if (status) filter.status = status;

    const requests = await Request.find(filter)
      .populate("receiver", "name email profilePhoto")
      .populate("listing", "location.city rentPerHead sharingType propertyType")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Accept Request ────────────────────────────────────────
const acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }
    if (request.receiver.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ success: false, message: `Request already ${request.status}` });
    }

    const listing = await Listing.findById(request.listing);
    if (!listing) {
      return res.status(404).json({ success: false, message: "Associated listing not found" });
    }
    if (listing.status !== "Active" || listing.roommatesNeeded <= 0) {
      return res.status(400).json({ success: false, message: "No spots available in this listing" });
    }

    request.status = "accepted";
    await request.save();

    listing.roommatesNeeded -= 1;
    if (listing.roommatesNeeded <= 0) listing.status = "Filled";
    await listing.save();

    const populated = await Request.findById(request._id)
      .populate("sender", "name email profilePhoto college course")
      .populate("listing", "location.city rentPerHead sharingType");

    return res.status(200).json({ success: true, data: populated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Reject Request ────────────────────────────────────────
const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }
    if (request.receiver.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ success: false, message: `Request already ${request.status}` });
    }

    request.status = "rejected";
    await request.save();

    return res.status(200).json({ success: true, message: "Request rejected" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Cancel Request (sender only) ──────────────────────────
const cancelRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }
    if (request.sender.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ success: false, message: "Cannot cancel a non-pending request" });
    }

    request.status = "cancelled";
    await request.save();

    return res.status(200).json({ success: true, message: "Request cancelled" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Delete Request History ─────────────────────────────────
const deleteRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }
    if (request.sender.toString() !== req.user.id && request.receiver.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await request.deleteOne();
    return res.status(200).json({ success: true, message: "Request deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Get Request Counts (for badge) ─────────────────────────
const getRequestCount = async (req, res) => {
  try {
    const pending = await Request.countDocuments({ receiver: req.user.id, status: "pending" });
    const accepted = await Request.countDocuments({ receiver: req.user.id, status: "accepted" });
    const sent = await Request.countDocuments({ sender: req.user.id, status: "pending" });
    return res.status(200).json({ success: true, data: { pendingReceived: pending, accepted: accepted, pendingSent: sent } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  sendRequest,
  getReceivedRequests,
  getSentRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  deleteRequest,
  getRequestCount,
};
