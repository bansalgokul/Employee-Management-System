import Project from "../../models/Project.js";
import Joi from "joi";
import Task from "../../models/Task.js";

const addTask = async (req, res) => {
	try {
		const { description, project, startedAt } = req.body;
		const user = req.user;

		const schema = Joi.object({
			description: Joi.string().required(),
			project: Joi.string().required(),
			startedAt: Joi.date().iso().required(),
		});

		const validation = schema.validate({
			description,
			project,
			startedAt,
		});
		if (validation.error) {
			return res.status(401).json({ error: "Invalid Credentials" });
		}

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const tommorow = new Date();
		tommorow.setDate(tommorow.getDate() + 1);
		tommorow.setHours(0, 0, 0, 0);

		const startedAtDate = new Date(startedAt);

		if (startedAtDate < today || startedAtDate > tommorow) {
			return res.status(401).json({
				error: "Invalid Start date",
			});
		}

		const projectDoc = await Project.findById(project);
		if (!projectDoc) {
			return res.status(404).json({ error: "Project not found" });
		}

		const taskDoc = await Task.create({
			description,
			project,
			user: user._id,
			startedAt: startedAtDate,
		});

		return res
			.status(201)
			.json({ message: "Task created successfully", taskDoc });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Cannot create Task" });
	}
};

const editTask = async (req, res) => {
	try {
		const { _id, description, project, startedAt, endedAt } = req.body;
		const user = req.user;

		const schema = Joi.object({
			_id: Joi.string().required(),
			description: Joi.string(),
			project: Joi.string(),
			startedAt: Joi.date().iso(),
			endedAt: Joi.date().iso(),
		});

		const validation = schema.validate({
			_id,
			description,
			project,
			startedAt,
			endedAt,
		});
		if (validation.error) {
			return res.status(401).json({ error: "Invalid Credentials" });
		}

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const tommorow = new Date();
		tommorow.setDate(tommorow.getDate() + 1);
		tommorow.setHours(0, 0, 0, 0);

		if (project) {
			const projectDoc = await Project.findById(project);
			if (!projectDoc) {
				return res.status(404).json({ error: "Project not found" });
			}
		}

		let startedAtDate;
		let endedAtDate;

		if (startedAt) {
			startedAtDate = new Date(startedAt);
			if (startedAtDate < today || startedAtDate > tommorow) {
				return res.status(401).json({
					error: "Invalid start date",
				});
			}
		}
		if (endedAt) {
			endedAtDate = new Date(endedAt);
			if (endedAtDate < today || endedAtDate > tommorow) {
				return res.status(401).json({
					error: "Invalid end date",
				});
			}
		}
		let taskDoc = await Task.findById(_id);
		if (!taskDoc) {
			return res.status(401).json({ error: "Invlaid Task" });
		}

		if (taskDoc.user.toString() !== user._id) {
			return res.status(400).json({ error: "Unauthorized user" });
		}

		const updateFields = {};
		if (description) updateFields.description = description;
		if (project) updateFields.project = project;
		if (startedAt) updateFields.startedAt = startedAtDate;
		if (endedAt) updateFields.endedAt = endedAtDate;

		taskDoc = await Task.findByIdAndUpdate(_id, updateFields, {
			new: true,
		});

		return res
			.status(200)
			.json({ message: "Task created successfully", taskDoc });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Cannot edit Task" });
	}
};

const deleteTask = async (req, res) => {
	try {
		const { id } = req.params;
		const user = req.user;

		const taskDoc = await Task.findById(id);
		if (!taskDoc) {
			return res.status(404).json({ error: "Task not found" });
		}

		if (taskDoc.user.toString() !== user._id) {
			return res
				.status(401)
				.json({ error: "Cannot delete this task. Unauthorized" });
		}

		await taskDoc.deleteOne();

		return res.status(200).json({ message: "Task deleted successfully" });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Cannot delete Task" });
	}
};

const getAllTask = async (req, res) => {
	try {
		const user = req.user;

		const taskDocs = await Task.find({ user: user._id }).populate([
			"user",
			"project",
		]);
		return res
			.status(200)
			.json({ taskDocs, messsage: "Tasks sent successfully" });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Cannot get Tasks" });
	}
};

const getTask = async (req, res) => {
	try {
		const { id } = req.params;
		const user = req.user;
		const taskDoc = await Task.findById(id).populate(["user", "project"]);
		if (!taskDoc) {
			return res.status(404).json({ error: "Task not found" });
		}

		if (taskDoc.user.toString() !== user._id) {
			return res.status(401).json({ error: "Cannot access this task" });
		}

		return res
			.status(200)
			.json({ message: "Task sent successfully", taskDoc });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Cannot get Task" });
	}
};

export { addTask, editTask, deleteTask, getAllTask, getTask };
