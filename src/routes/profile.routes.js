const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createProfile,
  updateProfile,
  getProfile,
} = require("../controllers/profile.controller");

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/profile/:userId", upload.array("photos", 5), createProfile);
router.get("/profile/:userId", getProfile);
router.patch("/profile/:userId", upload.array("photos", 5), updateProfile);

module.exports = router;
