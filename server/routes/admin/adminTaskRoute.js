import { Router } from "express";
const router = Router();
import {
	addTaskAdmin,
	getAllTaskAdmin,
	editTaskAdmin,
	getTaskAdmin,
	deleteTaskAdmin,
} from "../../controllers/admin/adminTaskController.js";

router.route("/").post(addTaskAdmin).get(getAllTaskAdmin).put(editTaskAdmin);

router.route("/:id").get(getTaskAdmin).delete(deleteTaskAdmin);

export default router;
