const express = require("express");
const router = express.Router();

const { seedUserAndProfile } = require("../controllers/hello.controller");

router.post("/", seedUserAndProfile);

module.exports = router;
