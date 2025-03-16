const express = require("express");
const router = express.Router();
const {
  createBasicInfo,
  getBasicInfo,
  updateBasicInfo,
  deleteBasicInfo,
} = require("../controllers/basicInfo.controller");

router.post("/info/:userId", createBasicInfo);
router.get("/info/:userId", getBasicInfo);
router.patch("/info/:userId", updateBasicInfo);
router.delete("/info/:userId", deleteBasicInfo);

module.exports = router;
