const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const taskSchema = new Schema({
	description: {
		type: String,
		required: true,
	},

	project: {
		type: Schema.Types.ObjectId,
		required: true,
	},

	user: {
		type: Schema.Types.ObjectId,
		required: true,
	},

	startedAt: {
		type: Schema.Types.Date,
		required: true,
	},

	endedAt: {
		type: Schema.Types.Date,
	},
});

const Task = model("Task", taskSchema);

module.exports = Task;
