const express = require("express");
const router = express.Router();
const adminTaskController = require("../../controllers/admin/adminTaskController");

router
	.route("/")
	.post(adminTaskController.addTaskAdmin)
	.get(adminTaskController.getAllTaskAdmin)
	.put(adminTaskController.editTaskAdmin);

router
	.route("/:id")
	.get(adminTaskController.getTaskAdmin)
	.delete(adminTaskController.deleteTaskAdmin);

module.exports = router;
