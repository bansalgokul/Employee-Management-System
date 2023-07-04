const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");
const verifyJWT = require("../middleware/verifyJWT");
const accessCheck = require("../middleware/accessCheck");

// /register
router.post("/", verifyJWT, accessCheck("admin"), registerController.newUser);

module.exports = router;
