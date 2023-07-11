import { Navigate, Route, Routes } from "react-router-dom";
import { User } from "../../App";

import HomeView from "../views/HomeView";
import UserDashLayout from "./UserDashLayout";
import ProfileView from "../views/ProfileView";
import TaskView from "../views/TaskView";
import ProjectView from "../views/ProjectView";
import AdminRoute from "../admin/AdminRoute";
import api from "../../api/api";
import { useEffect, useState } from "react";

type Props = {
	isLoggedIn: boolean;
	userInfo: User;
};

export type Project = {
	_id: string;
	title: string;
	description: string;
	completed: boolean;
	assigned: Array<{ user: User }>;
};

export type Task = {
	_id: string;
	description: string;
	project: Project;
	user: User;
	startedAt: Date;
	endedAt: Date;
};

const UserRoute = ({ isLoggedIn, userInfo }: Props) => {
	const [taskList, setTaskList] = useState<Task[]>([]);
	const [projectList, setProjectList] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);

		async function getData() {
			try {
				const taskResponse = await api.get("/task");
				if (taskResponse.status === 200) {
					setTaskList(taskResponse.data.taskDocs);
				}
				const projectResponse = await api.get("/project");
				if (projectResponse.status === 200) {
					setProjectList(projectResponse.data.projectDocs);
				}
				setLoading(false);
			} catch (error) {
				console.log("Error fetching Projects:", error);
			}
		}

		getData();
	}, []);

	if (!isLoggedIn) return <Navigate to='/login' replace />;

	return (
		<>
			{!loading && (
				<Routes>
					<Route path='/' element={<UserDashLayout />}>
						<Route
							index
							element={
								<HomeView
									taskList={taskList}
									setTaskList={setTaskList}
									projectList={projectList}
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
								/>
							}
						/>
						<Route
							path='project'
							element={<ProjectView projectList={projectList} />}
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
