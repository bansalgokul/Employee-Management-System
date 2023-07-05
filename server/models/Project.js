const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const projectSchema = new Schema({
	title: {
		type: String,
		required: true,
	},

	description: {
		type: String,
		required: true,
	},

	assigned: [
		{
			user: {
				type: Schema.Types.ObjectId,
				required: true,
			},
		},
	],

	completed: {
		type: Boolean,
		default: false,
	},
});

const Project = model("Project", projectSchema);

module.exports = Project;
