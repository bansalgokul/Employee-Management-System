import User from "../../models/User.js";
import Joi from "joi";
import bcrypt from "bcryptjs";

const editUser = async (req, res) => {
	try {
		const { _id, name, email, password, empID, roles } = req.body;

		const schema = Joi.object({
			_id: Joi.string().required(),
			name: Joi.string(),
			email: Joi.string().email(),
			password: Joi.string().min(6),
			empID: Joi.string().pattern(/^EMP-/),
			roles: Joi.string(),
		});

		const validation = schema.validate({
			_id,
			name,
			email,
			password,
			empID,
			roles,
		});
		if (validation.error) {
			return res.status(401).json({ error: "Invalid Credentials" });
		}

		const userD = await User.findById(_id);
		if (!userD) {
			return res.status(401).json({ error: "Invalid user" });
		}

		const updateField = {};
		if (name) {
			updateField.name = name;
		}
		if (email) {
			updateField.email = email;
		}
		if (password) {
			const hashedPassword = bcrypt.hashSync(password, process.env.SALT);
			updateField.password = hashedPassword;
		}
		if (empID) {
			updateField.empID = empID;
		}
		if (roles) {
			updateField.roles = roles;
		}

		const userDoc = await User.findByIdAndUpdate(_id, updateField, {
			new: true,
		});
		return res
			.status(200)
			.json({ message: "Updated user successfully", userDoc });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Cannot edit user" });
	}
};

const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;

		const response = await User.findByIdAndDelete(id);
		return res
			.status(200)
			.json({ message: "User deleted successfully", response });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Cannot delete User" });
	}
};

const getAllUser = async (req, res) => {
	try {
		const userDocs = await User.find();
		return res.status(200).json({ message: "User docs", userDocs });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Cannot get Users" });
	}
};

export { editUser, deleteUser, getAllUser };
