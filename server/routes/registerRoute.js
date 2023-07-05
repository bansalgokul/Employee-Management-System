const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");

// /register
router.post("/", registerController.newUser);

module.exports = router;
