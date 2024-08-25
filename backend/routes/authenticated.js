const { getUser } = require("../controller/authenticated");
const { authenticateToken } = require("../utils/authMiddleware");
const express = require("express");

const router = express.Router();

router.get("/user", authenticateToken, getUser);

module.exports = router;  