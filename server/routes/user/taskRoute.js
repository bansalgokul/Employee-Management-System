import { Router } from "express";
const router = Router();
import {
	addTask,
	getAllTask,
	editTask,
	getTask,
	deleteTask,
} from "../../controllers/user/taskController.js";

router.route("/").post(addTask).get(getAllTask).put(editTask);

router.route("/:id").get(getTask).delete(deleteTask);

export default router;
