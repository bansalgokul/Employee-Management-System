import User from "../models/User.js";
import bcyrpt from "bcryptjs";
import Joi from "joi";
import dotenv from "dotenv";
dotenv.config();

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

		const hashedPassword = bcyrpt.hashSync(password, process.env.SALT);

		const userDoc = await User.create({
			name,
			email,
			password: hashedPassword,
			empID,
			roles,
		});

		return res
			.status(201)
			.json({ message: "User added successfully", userDoc });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Cannot register user" });
	}
};

export { newUser };
