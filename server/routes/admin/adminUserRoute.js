import { Router } from "express";
const router = Router();
import {
	editUser,
	getAllUser,
	deleteUser,
} from "../../controllers/admin/adminUserController.js";

router.put("/", editUser).get("/", getAllUser);

router.route("/:id").delete(deleteUser);

export default router;
