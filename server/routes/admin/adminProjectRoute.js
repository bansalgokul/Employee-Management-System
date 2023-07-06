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
	.get(getAllProjectAdmin)
	.post(addProjectAdmin)
	.put(editProjectAdmin);

router.route("/:id").get(getProjectAdmin).delete(deleteProjectAdmin);

export default router;
