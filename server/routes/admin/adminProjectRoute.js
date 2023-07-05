const express = require("express");
const router = express.Router();
const adminProjectController = require("../../controllers/admin/adminProjectController");

router
	.route("/")
	.get(adminProjectController.getAllProjectAdmin)
	.post(adminProjectController.addProjectAdmin)
	.put(adminProjectController.editProjectAdmin);

router
	.route("/:id")
	.get(adminProjectController.getProjectAdmin)
	.delete(adminProjectController.deleteProjectAdmin);

module.exports = router;
