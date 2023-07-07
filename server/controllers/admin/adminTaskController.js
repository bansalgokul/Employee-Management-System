import Project from "../../models/Project.js";
import User from "../../models/User.js";
import Joi from "joi";
import Task from "../../models/Task.js";

const addTaskAdmin = async (req, res) => {
	try {
		const { description, project, startedAt, user, endedAt } = req.body;
		4;

		const schema = Joi.object({
			description: Joi.string().required(),
			project: Joi.string().required(),
			user: Joi.string().required(),
			startedAt: Joi.date().required(),
			endedAt: Joi.date(),
		});

		const validation = schema.validate({
			description,
			project,
			user,
			startedAt,
			endedAt,
		});

		if (validation.error) {
			return res.status(401).json({ error: "Invalid Credentials" });
		}

		const projectDoc = await Project.findById(project);
		if (!projectDoc) {
			return res.status(404).json({ error: "Project not found" });
		}

		const userDoc = await User.findById(user);
		if (!userDoc) {
			return res.status(404).json({ error: "User not found" });
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
		return res.status(500).json({ error: "Cannot create Task" });
	}
};

const editTaskAdmin = async (req, res) => {
	try {
		const { _id, description, project, startedAt, endedAt, user } =
			req.body;

		const schema = Joi.object({
			_id: Joi.string().required(),
			description: Joi.string(),
			project: Joi.string(),
			user: Joi.string(),
			startedAt: Joi.date(),
			endedAt: Joi.date(),
		});

		const validation = schema.validate({
			description,
			project,
			user,
			startedAt,
			endedAt,
		});

		if (validation.error) {
			return res.status(401).json({ error: "Invalid Credentials" });
		}

		let taskDoc = await Task.findById(_id);
		if (!taskDoc) {
			return res.status(404).json({ error: "Task not found" });
		}

		if (project) {
			const projectDoc = await Project.findById(project);
			if (!projectDoc) {
				return res.status(404).json({ error: "Project not found" });
			}
		}
		if (user) {
			const userDoc = await User.findById(user);
			if (!userDoc) {
				return res.status(404).json({ error: "User not found" });
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
			.json({ message: "Updated Task successfully", taskDoc });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Cannot edit Task" });
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
		return res.status(500).json({ error: "Cannot delete Task" });
	}
};

const getAllTaskAdmin = async (req, res) => {
	try {
		const taskDocs = await Task.find().populate(["project", "user"]);
		return res
			.status(200)
			.json({ taskDocs, messsage: "Tasks sent successfully" });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Cannot get Task" });
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
		return res.status(500).json({ error: "Cannot get Task" });
	}
};

export {
	addTaskAdmin,
	getAllTaskAdmin,
	getTaskAdmin,
	editTaskAdmin,
	deleteTaskAdmin,
};
