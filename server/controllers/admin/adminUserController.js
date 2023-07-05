const User = require("../../models/User");

const editUserSchema = Joi.object({
	_id: Joi.string().required(),
	name: Joi.string(),
	email: Joi.string().email(),
	password: Joi.string().min(6),
	empID: Joi.string().pattern(/^EMP-/),
	roles: Joi.array().items(Joi.string()),
});

const editUser = async (req, res) => {
	try {
		const { _id, name, email, password, empID, roles } = req.body;

		const validation = editUserSchema.validate({
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

		const hashedPassword = bcyrpt.hashSync(password, process.env.SALT);

		const updateField = {};
		if (name) {
			updateField.name = name;
		}
		if (email) {
			updateField.email = email;
		}
		if (password) {
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
		return res.status(200).json({ message: "Update user successful" });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Edit User Admin error" });
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
		return res.status(500).json({ error: "Delete User Admin error" });
	}
};

const getAllUser = async (req, res) => {
	try {
		const userDocs = await User.find();
		return res.status(200).json({ message: "User docs", userDocs });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Get All User Admin error" });
	}
};

module.exports = { editUser, deleteUser, getAllUser };
