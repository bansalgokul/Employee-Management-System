const express = require("express");
const router = express.Router();
const projectController = require("../../controllers/user/projectController");

router.get("/", projectController.getAllProject);
router.get("/:id", projectController.getProject);

module.exports = router;
