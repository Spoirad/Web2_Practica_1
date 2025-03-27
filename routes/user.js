const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/user.js");
const { validatorCreateItem } = require("../validators/user.js");
const { authMiddleware } = require("../middleware/authMiddleware.js");

router.post("/register", authMiddleware, validatorCreateItem, registerUser);

module.exports = router;
