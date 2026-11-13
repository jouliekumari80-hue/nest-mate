const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  sendRequest,
  getReceivedRequests,
  getSentRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  deleteRequest,
  getRequestCount,
} = require("../controllers/requestController");

router.use(protect);

router.post("/", sendRequest);
router.get("/received", getReceivedRequests);
router.get("/sent", getSentRequests);
router.get("/count", getRequestCount);
router.patch("/:id/accept", acceptRequest);
router.patch("/:id/reject", rejectRequest);
router.patch("/:id/cancel", cancelRequest);
router.delete("/:id", deleteRequest);

module.exports = router;
