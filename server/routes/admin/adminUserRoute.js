const express = require("express");
const router = express.Router();
const adminUserController = require("../../controllers/admin/adminUserController");

router.put("/", adminUserController.editUser);

router
	.route("/:id")
	.get(adminUserController.getAllUser)
	.delete(adminUserController.deleteUser);

module.exports = router;
