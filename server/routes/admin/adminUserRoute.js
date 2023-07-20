import { Router } from "express";
const router = Router();
import {
	editUser,
	deleteUser,
	getAdminUser,
	newUser,
} from "../../controllers/admin/adminUserController.js";

router.route("/").post(newUser).put(editUser).get(getAdminUser);

router.route("/:id").delete(deleteUser);

export default router;
