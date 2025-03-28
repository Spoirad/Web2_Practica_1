const express = require("express");
const router = express.Router();
const { registerUser, validateEmail, loginUser } = require("../controllers/user.js");
const { validatorCreateItem, validatorVerificate, validatorLogin } = require("../validators/user.js");
const { authMiddleware } = require("../middleware/authMiddleware.js");

router.post("/register", validatorCreateItem, registerUser);
router.put("/validation", authMiddleware, validatorVerificate, validateEmail);
router.post("/login", validatorLogin, loginUser);
module.exports = router;
