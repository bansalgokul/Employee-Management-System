import Project from "../../models/Project.js";
import User from "../../models/User.js";
import Joi from "joi";
import Task from "../../models/Task.js";
import mongoose from "mongoose";

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
		skip = parseInt(skip) || 0;
		const fromDate = from
			? new Date(new Date(from).setHours(0, 0, 0))
			: new Date(0, 0, 0);
		const toDate = to ? new Date(to) : new Date();

		const pipeline = [
			{
				$lookup: {
					from: "users",
					localField: "user",
					foreignField: "_id",
					as: "user",
				},
			},
			{
				$lookup: {
					from: "projects",
					localField: "project",
					foreignField: "_id",
					as: "project",
				},
			},
			{
				$unwind: {
					path: "$user",
					preserveNullAndEmptyArrays: false,
				},
			},
			{
				$unwind: {
					path: "$project",
					preserveNullAndEmptyArrays: false,
				},
			},
			{
				$sort: {
					startedAt: -1,
					endedAt: -1,
				},
			},
		];

		if (!group || (target && target !== null)) {
			let filteredTasksPipeline = pipeline.concat([
				{
					$match: {
						$or: [
							{
								description: {
									$regex: search,
									$options: "i",
								},
							},
							{
								"user.name": {
									$regex: search,
									$options: "i",
								},
							},
							{
								"project.title": {
									$regex: search,
									$options: "i",
								},
							},
						],
						startedAt: {
							$gte: fromDate,
							$lte: toDate,
						},
					},
				},
			]);

			if (!group && target && target !== null) {
				filteredTasksPipeline.push({
					$match: {
						_id: new mongoose.Types.ObjectId(target),
					},
				});
			}

			if (group === "project") {
				filteredTasksPipeline.push({
					$match: {
						"project._id": new mongoose.Types.ObjectId(target),
					},
				});
			}
			if (group === "user") {
				filteredTasksPipeline.push({
					$match: {
						"user._id": new mongoose.Types.ObjectId(target),
					},
				});
			}

			const countTasksPipeline = filteredTasksPipeline.concat({
				$count: "totalRecords",
			});
			const totalRecordsDoc = await Task.aggregate(countTasksPipeline);
			const totalRecords = totalRecordsDoc?.[0]?.totalRecords || 0;
			limit = parseInt(limit) || totalRecords;
			const skippedTasksPipeline = filteredTasksPipeline.concat([
				{
					$skip: skip,
				},
				{
					$limit: limit,
				},
			]);
			const taskDocs = await Task.aggregate(skippedTasksPipeline);

			return res.status(200).json({
				taskDocs,
				totalRecords,
			});
		}

		if (group === "project" || group === "user") {
			let groupPipeline = pipeline.concat({
				$match:
					group === "project"
						? {
								"project.title": {
									$regex: search,
									$options: "i",
								},
						  }
						: {
								"user.name": {
									$regex: search,
									$options: "i",
								},
						  },
			});
			groupPipeline = groupPipeline.concat({
				$group: {
					_id: "",
					groups: {
						$addToSet: group === "project" ? "$project" : "$user",
					},
				},
			});
			const groupDocs = await Task.aggregate(groupPipeline);
			const groups = groupDocs[0].groups;
			return res.status(200).json({
				responseArray: groups,
				totalRecords: groups.length,
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
