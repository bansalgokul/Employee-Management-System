import { Router } from "express";
const router = Router();
import {
	editUser,
	getAllUser,
	deleteUser,
} from "../../controllers/admin/adminUserController.js";

router.put("/", editUser);

router.route("/:id").get(getAllUser).delete(deleteUser);

export default router;
