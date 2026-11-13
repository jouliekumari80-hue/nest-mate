const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { toggleSave, getSavedListings, checkSaved } = require("../controllers/savedController");

router.use(protect);

router.get("/", getSavedListings);
router.post("/:listingId", toggleSave);
router.get("/:listingId/check", checkSaved);

module.exports = router;
