const express = require("express");
const router = express.Router();
const taskController = require("../../controllers/user/taskController");

router
	.route("/")
	.post(taskController.addTask)
	.get(taskController.getAllTask)
	.put(taskController.editTask);

router
	.route("/:id")
	.get(taskController.getTask)
	.delete(taskController.deleteTask);

module.exports = router;
