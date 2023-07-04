const mongoose = require("mongoose");
const validator = require("validator");
const { Schema, model } = mongoose;

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},

	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		validate: (value) => {
			return validator.isEmail(value);
		},
	},

	password: {
		type: String,
		required: true,
	},

	empID: {
		type: String,
		required: true,
	},

	roles: {
		enum: ["admin", "emp"],
	},
});

const User = model("User", userSchema);
module.exports = User;

// var newUser = new User({ email: 'email@email.com', role: 'user' })
