import Project from "../../models/Project.js";

const getAllProject = async (req, res) => {
	try {
		const user = req.user;

		const projectDocs = await Project.find({
			"assigned.user": user._id,
		}).populate("assigned.user");

		if (!projectDocs) {
			return res
				.status(400)
				.json({ error: "Project not found for the user" });
		}

		return res.status(200).json({ projectDocs });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Cannot get Project" });
	}
};

const getProject = async (req, res) => {
	try {
		const { id } = req.params;
		const user = req.user;

		const projectDoc = await Project.find({
			_id: id,
			"assigned.user": user._id,
		});

		console.log(projectDoc);

		if (!projectDoc) {
			return res
				.status(404)
				.json({ error: "Project not found for the user" });
		}

		return res.status(200).json({ projectDoc });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Cannot get Project" });
	}
};

export { getAllProject, getProject };
