const Project = require("../../models/Project");
const User = require("../../models/User");
// Admin

const addProjectAdmin = async (req, res) => {
	try {
		const { title, description, assignees, completed } = req.body;
		if (!title || !description) {
			return res.status(401).json({ error: "Missing req credentials" });
		}

		const assigned = [];
		if (assignees) {
			for (const assignee of assignees) {
				const userDoc = await User.findById(assignee.user);
				if (!userDoc) {
					return res.status(404).json({ error: "Invalid assignees" });
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

		return res.status(201).json({
			message: "Project created successfully",
			projectDoc,
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Create Project Admin error" });
	}
};

const editProjectAdmin = async (req, res) => {
	try {
		const { _id, title, description, assignees, completed } = req.body;
		if (!_id) {
			return res.status(401).json({ error: "Missing credentials" });
		}

		let projectDoc = await Project.findById(_id);
		if (!projectDoc) {
			return res.status(404).json({ error: "Invalid project" });
		}

		const assigned = [];
		if (assignees?.length > 0) {
			for (const assignee of assignees) {
				const userDoc = await User.findById(assignee.user);
				if (!userDoc) {
					return res.status(404).json({ error: "Invalid assignees" });
				}
				assigned.push({ user: assignee.user });
			}
		}
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

		return res.status(200).json({
			message: "Project updated successfully",
			response,
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Edit Project Admin error" });
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
		return res.status(500).json({ error: "Delete Project Admin error" });
	}
};

const getAllProjectAdmin = async (req, res) => {
	try {
		const projectDocs = await Project.find();
		return res
			.status(200)
			.json({ projectDocs, messsage: "Projects sent successfully" });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Get All Project Admin error" });
	}
};

const getProjectAdmin = async (req, res) => {
	try {
		const { id } = req.params;
		const projectDoc = await Project.findById(id);
		if (!projectDoc) {
			return res.status(400).json({ error: "Project not found" });
		}
		return res
			.status(200)
			.json({ message: "Project sent successfully", projectDoc });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Get Project Admin error" });
	}
};

module.exports = {
	addProjectAdmin,
	editProjectAdmin,
	deleteProjectAdmin,
	getAllProjectAdmin,
	getProjectAdmin,
};
