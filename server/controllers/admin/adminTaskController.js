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
		const { _id, description, project, startedAt, endedAt } = req.body;

		const schema = Joi.object({
			_id: Joi.string().required(),
			description: Joi.string(),
			project: Joi.string(),
			startedAt: Joi.date(),
			endedAt: Joi.date(),
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

		const updateFields = {};
		if (description) updateFields.description = description;
		if (project) updateFields.project = project;
		if (startedAt) updateFields.startedAt = new Date(startedAt);
		if (endedAt) updateFields.endedAt = new Date(endedAt);

		taskDoc = await Task.findByIdAndUpdate(_id, updateFields, {
			new: true,
		});
		await taskDoc.populate(["user", "project"]);
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
		let { group, search, target, skip, limit, from, to } = req.query;
		search = search || "";
		skip = skip || 0;
		const fromDate = from
			? new Date(new Date(from).setHours(0, 0, 0))
			: new Date(0, 0, 0);
		const toDate = to ? new Date(to) : new Date();

		const taskDocs = await Task.find({
			startedAt: {
				$gte: fromDate,
				$lte: toDate,
			},
		})
			.sort({ startedAt: -1 })
			.populate(["user", "project"]);

		const filterTasksBySearch = (task) => {
			const regex = new RegExp(search, "i");

			return (
				task.user &&
				task.project &&
				(group === "project"
					? task.project.title.match(regex)
					: group === "user"
					? task.user.name.match(regex)
					: task.project.title.match(regex) ||
					  task.user.name.match(regex) ||
					  task.description.match(regex))
			);
		};

		const filteredTasks = taskDocs.filter(filterTasksBySearch);
		const totalRecords = filteredTasks.length;

		if (!group) {
			limit = limit || totalRecords;
			const skippedTasks = filteredTasks.slice(skip, skip + limit);
			return res
				.status(200)
				.json({ taskDocs: skippedTasks, totalRecords });
		}
		if (group === "project") {
			if (target && target !== "null") {
				let taskDocs = await Task.find({
					project: target,
					startedAt: {
						$gte: fromDate,
						$lte: toDate,
					},
				})
					.sort({ startedAt: -1 })
					.populate(["user", "project"]);
				let filteredTasks = taskDocs.filter(
					(task) => task.user && task.project,
				);
				limit = limit || filteredTasks.length;

				let skippedTasks = filteredTasks.slice(
					parseInt(skip),
					parseInt(skip) + parseInt(limit),
				);

				return res.status(200).json({
					taskDocs: skippedTasks,
					totalRecords: filteredTasks.length,
				});
			}
			const responseArray = [];
			filteredTasks.forEach((task) => {
				if (
					!responseArray.find((item) => item._id === task.project._id)
				) {
					responseArray.push(task.project);
				}
			});

			return res.status(200).json({
				responseArray,
			});
		}
		if (group === "user") {
			if (target && target !== "null") {
				let taskDocs = await Task.find({
					user: target,
					startedAt: {
						$gte: fromDate,
						$lte: toDate,
					},
				})
					.sort({ startedAt: -1 })
					.populate(["user", "project"]);
				let filteredTasks = taskDocs.filter(
					(task) => task.user && task.project,
				);
				limit = limit || filteredTasks.length;

				let skippedTasks = filteredTasks.slice(
					parseInt(skip),
					parseInt(skip) + parseInt(limit),
				);

				return res.status(200).json({
					taskDocs: skippedTasks,
					totalRecords: filteredTasks.length,
				});
			}
			const responseArray = [];
			filteredTasks.forEach((task) => {
				if (!responseArray.find((item) => item._id === task.user._id)) {
					responseArray.push(task.user);
				}
			});

			return res.status(200).json({
				responseArray,
			});
		}
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

const getTaskGroupedProject = async (req, res) => {
	const groupedTasksByProject = [];

	const taskDocs = await Task.find().sort({ updatedAt: -1 });

	taskDocs.forEach((task) => {
		if (
			!groupedTasksByProject.find(
				(group) => group.userID.toString() === task.user._id.toString(),
			)
		) {
			groupedTasksByProject.push({ user: task.user._id, taskArray: [] });
		}

		groupedTasksByProject
			.find(
				(group) => group.userID.toString() === task.user._id.toString(),
			)
			.taskArray.push(task);
	});

	return res.status(200).json({ groupedTasksByProject });
};

export {
	addTaskAdmin,
	getAllTaskAdmin,
	getTaskAdmin,
	editTaskAdmin,
	getTaskGroupedProject,
	deleteTaskAdmin,
};
