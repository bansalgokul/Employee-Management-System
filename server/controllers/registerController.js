const validator = require("validator");
const User = require("../models/User");
const bcyrpt = require("bcryptjs");
require("dotenv").config();

const newUser = async (req, res) => {
	const { name, email, password, empID, roles } = req.body;

	if (!name || !email || !password || !empID || !roles) {
		return res.status(400).json({ error: "Missing Credentials" });
	}

	if (!validator.isEmail(email)) {
		return res.status(400).json({ error: "Email not valid" });
	}

	if (password.length < 6) {
		return res.status(400).json({ error: "Password Too Weak" });
	}

	if (!empID.startsWith("EMP-")) {
		return res.status(400).json({ error: "EMP Id invalid" });
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
};

module.exports = { newUser };
