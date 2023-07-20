import { Project, Task } from "../components/types";
import api from "./api";

const getUserTasks = async (
	setTaskList: React.Dispatch<React.SetStateAction<Task[]>>,
) => {
	const response = await api.get("/task");
	if (response.status === 200) {
		response.data.taskDocs =
			// filter the tasks where user or project is deleted
			response.data.taskDocs.filter(
				(task: Task) => task.user !== null && task.project !== null,
			);
		setTaskList(response.data.taskDocs);
	}
};

const getUserProjects = async (
	setProjectList: React.Dispatch<React.SetStateAction<Project[]>>,
) => {
	const response = await api.get("/project");

	if (response.status === 200) {
		response.data.projectDocs.forEach(
			(project: Project) =>
				// filter the tasks where user is deleted
				(project.assigned = project.assigned.filter(
					(p) => p.user?._id,
				)),
		);
		setProjectList(response.data.projectDocs);
	}
};

export { getUserTasks, getUserProjects };
