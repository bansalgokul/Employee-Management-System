import Project from "../../models/Project.js";
import User from "../../models/User.js";
import Joi from "joi";

const addProjectAdmin = async (req, res) => {
	try {
		const { title, description, assignees, completed } = req.body;

		const schema = Joi.object({
			title: Joi.string().required(),
			description: Joi.string().required(),
			completed: Joi.boolean(),
			assignees: Joi.array().items(Joi.object()),
		});

		const validation = schema.validate({
			title,
			description,
			completed,
			assignees,
		});
		if (validation.error) {
			console.log(validation);
			return res.status(401).json({ error: "Invalid Credentials" });
		}

		const assigned = [];
		if (assignees) {
			for (const assignee of assignees) {
				const userDoc = await User.findById(assignee.user);
				if (!userDoc) {
					return res
						.status(404)
						.json({ error: "Assignees not found" });
				}
				assigned.push({ user: assignee.user });
			}
		}

		const addFields = {
			title,
			description,
			assigned: assigned ? assigned : [],
			completed: completed ? completed : false,
		};

		const projectDoc = await Project.create(addFields);
		await projectDoc.populate("assigned.user");

		return res.status(201).json({
			message: "Project created successfully",
			projectDoc,
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Failed to create project" });
	}
};

const editProjectAdmin = async (req, res) => {
	try {
		const { _id, title, description, assignees, completed } = req.body;

		const schema = Joi.object({
			_id: Joi.string().required(),
			title: Joi.string(),
			description: Joi.string(),
			completed: Joi.boolean(),
			assignees: Joi.array().items(Joi.object()),
		});

		const validation = schema.validate({
			_id,
			title,
			description,
			completed,
			assignees,
		});
		if (validation.error) {
			console.log(validation);
			return res.status(401).json({ error: "Invalid Credentials" });
		}

		let projectDoc = await Project.findById(_id);
		if (!projectDoc) {
			return res.status(404).json({ error: "Project not found" });
		}

		const assigned = [];
		if (assignees?.length > 0) {
			for (const assignee of assignees) {
				const userDoc = await User.findById(assignee.user);
				if (!userDoc) {
					return res
						.status(404)
						.json({ error: "Assignees not found" });
				}
				assigned.push({ user: assignee.user });
			}
		}
		console.log(assignees);
		const updateFields = {};
		if (title) {
			updateFields.title = title;
		}
		if (description) {
			updateFields.description = description;
		}

		if (assigned.length > 0) {
			updateFields.assigned = assigned;
		}
		if (completed !== undefined) {
			updateFields.completed = completed;
		}

		const response = await Project.findByIdAndUpdate(_id, updateFields, {
			new: true,
		});
		await response.populate("assigned.user");

		return res.status(200).json({
			message: "Project updated successfully",
			projectDoc: response,
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Cannot update project" });
	}
};

const deleteProjectAdmin = async (req, res) => {
	try {
		const { id } = req.params;

		const projectDoc = await Project.findById(id);
		if (!projectDoc) {
			return res.status(404).json({ error: "Project not found" });
		}

		await projectDoc.deleteOne();
		return res
			.status(200)
			.json({ message: "Project deleted successfully" });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Cannot delete project" });
	}
};

const getAllProjectAdmin = async (req, res) => {
	try {
		const projectDocs = await Project.find().populate("assigned.user");
		return res
			.status(200)
			.json({ projectDocs, messsage: "Projects sent successfully" });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Cannot get projects" });
	}
};

// search / skip / limit / id
const getProjectAdmin = async (req, res) => {
	if (req.query) {
		let { search, id, length, skip, limit } = req.query;

		// To calculate total records in db
		const projectDocsLength = await Project.countDocuments({
			title: { $regex: `${search}`, $options: "i" },
		});

		search = search || "";
		skip = skip || 0;
		limit = limit || projectDocsLength;

		if (id) {
			try {
				const projectDoc = await Project.findById(id).populate(
					"assigned.user",
				);
				return res.status(200).json({ projectDoc });
			} catch (err) {
				console.log(err);
				return res.status(404).json({ error: "Project not found" });
			}
		}

		try {
			const projectDocs = await Project.find({
				title: { $regex: search, $options: "i" },
			})
				.sort({ updatedAt: -1 })
				.skip(skip)
				.limit(limit)
				.populate("assigned.user");
			return res
				.status(200)
				.json({ totalRecords: projectDocsLength, projectDocs });
		} catch (err) {
			console.log(err);
			return res.status(404).json({ error: "Projects not found" });
		}
	}

	try {
		const projectDocs = await Project.find()
			.sort({ updatedAt: -1 })
			.populate("assigned.user");
		return res.status(200).json({ projectDocs });
	} catch (err) {
		console.log(err);
		return res.status(404).json({ error: "Projects not found" });
	}
};

export {
	addProjectAdmin,
	editProjectAdmin,
	deleteProjectAdmin,
	getAllProjectAdmin,
	getProjectAdmin,
};
