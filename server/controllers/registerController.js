const validator = require("validator");
const User = require("../models/User");
const bcyrpt = require("bcryptjs");
const Joi = require("joi");
require("dotenv").config();

const newUserSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
	empID: Joi.string().pattern(/^EMP-/).required(),
	roles: Joi.array().items(Joi.string()).required(),
});

const newUser = async (req, res) => {
	try {
		const { name, email, password, empID, roles } = req.body;
		const validation = newUserSchema.validate({
			name,
			email,
			password,
			empID,
			roles,
		});
		if (validation.error) {
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
		return res.status(500).json({ error: "Register user error" });
	}
};

module.exports = { newUser };
