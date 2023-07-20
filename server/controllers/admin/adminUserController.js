import User from "../../models/User.js";
import Joi from "joi";
import bcrypt from "bcryptjs";

const newUser = async (req, res) => {
	try {
		const { name, email, password, empID, roles } = req.body;

		const schema = Joi.object({
			name: Joi.string().required(),
			email: Joi.string().email().required(),
			password: Joi.string().min(6).required(),
			empID: Joi.string().pattern(/^EMP-/).required(),
			roles: Joi.string().required(),
		});

		const validation = schema.validate({
			name,
			email,
			password,
			empID,
			roles,
		});
		if (validation.error) {
			console.log(validation.error);
			return res.status(401).json({ error: "Invalid Credentials" });
		}

		const hashedPassword = bcrypt.hashSync(password, process.env.SALT);

		await User.create({
			name,
			email,
			password: hashedPassword,
			empID,
			roles,
		});

		const userDoc = await User.find({ email });

		return res
			.status(201)
			.json({ message: "User added successfully", userDoc });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Cannot register user" });
	}
};

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

const getAdminUser = async (req, res) => {
	if (req.query) {
		let { search, id, length, skip, limit } = req.query;
		search = search || "";
		const userDocsLength = await User.countDocuments({
			$or: [
				{ name: { $regex: search, $options: "i" } },
				{ email: { $regex: search, $options: "i" } },
				{ empID: { $regex: search, $options: "i" } },
			],
		});
		skip = skip || 0;
		limit = limit || userDocsLength;

		// Return project with project id
		if (id) {
			try {
				const userDoc = await User.findById(id);
				return res.status(200).json({ userDoc });
			} catch (err) {
				console.log(err);
				return res.status(404).json({ error: "User not found" });
			}
		}

		// Searching with skip and limit / pagination

		try {
			const userDocs = await User.find({
				$or: [
					{ name: { $regex: search, $options: "i" } },
					{ email: { $regex: search, $options: "i" } },
					{ empID: { $regex: search, $options: "i" } },
				],
			})
				.sort({ updatedAt: -1 })
				.skip(skip)
				.limit(limit);
			return res
				.status(200)
				.json({ totalRecords: userDocsLength, userDocs });
		} catch (err) {
			console.log(err);
			return res.status(404).json({ error: "Users not found" });
		}

		// Searching with search text filter
	}

	try {
		const userDocs = await User.find().sort({ updatedAt: -1 });
		return res.status(200).json({ userDocs });
	} catch (err) {
		console.log(err);
		return res.status(404).json({ error: "Users not found" });
	}
};

export { newUser, editUser, deleteUser, getAdminUser };
