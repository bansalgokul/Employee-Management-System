import mongoose from "mongoose";
const { Schema, model } = mongoose;

const taskSchema = new Schema({
	description: {
		type: String,
		required: true,
	},

	project: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "Project",
	},

	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},

	startedAt: {
		type: Schema.Types.Date,
		required: true,
	},

	endedAt: {
		type: Schema.Types.Date,
	},
}, {timestamps: true});

const Task = model("Task", taskSchema);

export default Task;
