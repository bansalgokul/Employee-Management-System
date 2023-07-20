import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			minLength: [4, "Name too short"],
		},

		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},

		password: {
			type: String,
			required: true,
			select: false,
		},

		empID: {
			type: String,
			required: true,
			unique: true,
		},

		roles: {
			type: String,
			required: true,
			enum: ["admin", "emp"],
		},
	},
	{ timestamps: true },
);

const User = model("User", userSchema);
export default User;
