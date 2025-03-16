const express = require("express");
const router = express.Router();

const {
  getNearbyUsers,
} = require("../controllers/specificLocation.controller");

router.post("/users/nearby", getNearbyUsers);

module.exports = router;
