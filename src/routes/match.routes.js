const express = require("express");
const router = express.Router();
const {
  updateOrderedProfiles,
  getMatches,
} = require("../controllers/match.controller");

router.post("/match/:profileId", updateOrderedProfiles);
router.get("/match/:profileId", getMatches);

module.exports = router;
