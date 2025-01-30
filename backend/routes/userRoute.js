const express = require("express");
const { checkEligibility } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/check-eligibility",authMiddleware, checkEligibility);

module.exports = router;