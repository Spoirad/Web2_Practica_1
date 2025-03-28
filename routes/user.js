const express = require("express");
const router = express.Router();
const { registerUser, validateEmail } = require("../controllers/user.js");
const { validatorCreateItem, validatorVerificate } = require("../validators/user.js");
const { authMiddleware } = require("../middleware/authMiddleware.js");

router.post("/register", validatorCreateItem, registerUser);
router.put("/validation", authMiddleware, validatorVerificate, validateEmail);

module.exports = router;
