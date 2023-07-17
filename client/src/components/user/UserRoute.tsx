import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import HomeView from "./HomeView";
import DashLayout from "../Shared/DashLayout";
import ProfileView from "../features/user/employee/ProfileView";
import TaskView from "../features/task/employee/TaskView";
import ProjectView from "../features/project/employee/ProjectView";
import AdminRoute from "../admin/AdminRoute";
import api from "../../api/api";
import { useEffect, useState } from "react";
import { Project, Task, User } from "../types";
import Loading from "../Shared/Loading";

type Props = {
	isLoggedIn: boolean;
	userInfo: User;
};

const UserRoute = ({ isLoggedIn, userInfo }: Props) => {
	const [taskList, setTaskList] = useState<Task[]>([]);
	const [projectList, setProjectList] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		setLoading(true);

		async function getData() {
			try {
				const taskResponse = await api.get("/task");
				if (taskResponse.status === 200) {
					taskResponse.data.taskDocs =
						taskResponse.data.taskDocs.filter(
							(task: Task) =>
								task.user !== null && task.project !== null,
						);
					setTaskList(taskResponse.data.taskDocs);
				}
				const projectResponse = await api.get("/project");

				if (projectResponse.status === 200) {
					projectResponse.data.projectDocs.forEach(
						(project: Project) =>
							(project.assigned = project.assigned.filter(
								(p) => p.user?._id,
							)),
					);
					setProjectList(projectResponse.data.projectDocs);
				}

				setLoading(false);
			} catch (error) {
				console.log("Error fetching Projects:", error);
				navigate("/login");
			}
		}

		getData();
	}, []);

	if (!isLoggedIn) return <Navigate to='/login' replace />;

	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<Routes>
					<Route path='/' element={<DashLayout isAdmin={false} />}>
						<Route
							index
							element={
								<HomeView
									taskList={taskList}
									setTaskList={setTaskList}
									projectList={projectList}
									setProjectList={setProjectList}
								/>
							}
						/>
						<Route
							path='profile'
							element={<ProfileView userInfo={userInfo} />}
						/>
						<Route
							path='task'
							element={
								<TaskView
									taskList={taskList}
									setTaskList={setTaskList}
									projectList={projectList}
									setProjectList={setProjectList}
								/>
							}
						/>
						<Route
							path='project'
							element={
								<ProjectView
									projectList={projectList}
									setProjectList={setProjectList}
								/>
							}
						/>
					</Route>
					<Route
						path='admin/*'
						element={
							<AdminRoute
								userInfo={userInfo}
								taskList={taskList}
								setTaskList={setTaskList}
								projectList={projectList}
								setProjectList={setProjectList}
							/>
						}
					/>
				</Routes>
			)}
		</>
	);
};

export default UserRoute;
