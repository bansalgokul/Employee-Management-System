const Project = require("../../models/Project");
const Task = require("../../models/Task");
const User = require("../../models/User");

const addTaskAdmin = async (req, res) => {
	try {
		const { description, project, startedAt, user, endedAt } = req.body;
		if (!description || !project || !user || !startedAt) {
			return res.status(401).json({ error: "Missing credentials" });
		}

		const projectDoc = await Project.findById(project);
		if (!projectDoc) {
			return res.status(404).json({ error: "Invalid project" });
		}

		const userDoc = await User.findById(user);
		if (!userDoc) {
			return res.status(404).json({ error: "Invalid user" });
		}

		const addFields = {
			description,
			project,
			user,
			startedAt,
		};
		if (endedAt) addFields.endedAt = new Date(endedAt);

		const taskDoc = await Task.create(addFields);

		return res
			.status(201)
			.json({ message: "Task created successfully", taskDoc });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Add Task Admin error" });
	}
};

const editTaskAdmin = async (req, res) => {
	try {
		const { _id, description, project, startedAt, endedAt, user } =
			req.body;

		if (!_id) {
			return res.status(401).json({ error: "Missing id credential" });
		}

		let taskDoc = await Task.findById(_id);
		if (!taskDoc) {
			return res.status(404).json({ error: "Task not found" });
		}

		if (project) {
			const projectDoc = await Project.findById(project);
			if (!projectDoc) {
				return res.status(404).json({ error: "Invalid project" });
			}
		}
		if (user) {
			const userDoc = await User.findById(user);
			if (!userDoc) {
				return res.status(404).json({ error: "Invalid user" });
			}
		}

		const updateFields = {};
		if (description) updateFields.description = description;
		if (project) updateFields.project = project;
		if (startedAt) updateFields.startedAt = new Date(startedAt);
		if (endedAt) updateFields.endedAt = new Date(endedAt);

		taskDoc = await taskDoc.updateOne(updateFields, { new: true });

		return res
			.status(200)
			.json({ message: "Updated created successfully", taskDoc });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Edit Task Admin error" });
	}
};

const deleteTaskAdmin = async (req, res) => {
	try {
		const { id } = req.params;

		const taskDoc = await Task.findById(id);
		if (!taskDoc) {
			return res.status(404).json({ error: "Task not found" });
		}

		await taskDoc.deleteOne();
		return res.status(200).json({ message: "Task deleted successfully" });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Delete Task Admin error" });
	}
};

const getAllTaskAdmin = async (req, res) => {
	try {
		const taskDocs = await Task.find();
		return res
			.status(200)
			.json({ taskDocs, messsage: "Tasks sent successfully" });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Get All Task Admin error" });
	}
};

const getTaskAdmin = async (req, res) => {
	try {
		const { id } = req.params;
		const taskDoc = await Task.findById(id);
		if (!taskDoc) {
			return res.status(400).json({ error: "Task not found" });
		}
		return res
			.status(200)
			.json({ message: "Task sent successfully", taskDoc });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Get Task Admin error" });
	}
};

module.exports = {
	addTaskAdmin,
	getAllTaskAdmin,
	getTaskAdmin,
	editTaskAdmin,
	deleteTaskAdmin,
};
