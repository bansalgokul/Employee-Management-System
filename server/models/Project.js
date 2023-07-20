import mongoose from "mongoose";
const { Schema, model } = mongoose;

const projectSchema = new Schema(
	{
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
					ref: "User",
				},
				_id: false,
			},
		],

		completed: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

const Project = model("Project", projectSchema);

export default Project;
