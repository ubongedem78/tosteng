const express = require("express");
const router = express.Router();
const {
  likeProfile,
  unlikeProfile,
  getLikes,
} = require("../controllers/likes.controller");

router.post("/likes/like", likeProfile);
router.delete("/likes/:likeId", unlikeProfile);
router.get("/likes/:userId", getLikes);

module.exports = router;
