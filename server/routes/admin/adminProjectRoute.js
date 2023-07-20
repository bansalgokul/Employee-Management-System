import { Router } from "express";
const router = Router();
import {
	getAllProjectAdmin,
	addProjectAdmin,
	editProjectAdmin,
	getProjectAdmin,
	deleteProjectAdmin,
} from "../../controllers/admin/adminProjectController.js";

router
	.route("/")
	.get(getProjectAdmin)
	.post(addProjectAdmin)
	.put(editProjectAdmin);

router.route("/:id").delete(deleteProjectAdmin);

export default router;
