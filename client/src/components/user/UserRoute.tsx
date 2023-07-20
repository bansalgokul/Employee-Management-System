import { Route, Routes, useNavigate } from "react-router-dom";

import HomeView from "./HomeView";
import DashLayout from "../Shared/DashLayout";
import ProfileView from "../features/user/employee/ProfileView";
import TaskView from "../features/task/employee/TaskView";
import ProjectView from "../features/project/employee/ProjectView";
import AdminRoute from "../admin/AdminRoute";
import { useEffect, useState } from "react";
import { Project, Task, User } from "../types";
import Loading from "../Shared/Loading";
import { getUserProjects, getUserTasks } from "../../api/apiFunctions";

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
		if (!isLoggedIn) {
			navigate("/login");
		}
		setLoading(true);
		async function getData() {
			await getUserTasks(setTaskList);
			await getUserProjects(setProjectList);
			setLoading(false);
		}
		getData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
						element={<AdminRoute userInfo={userInfo} />}
					/>
				</Routes>
			)}
		</>
	);
};

export default UserRoute;
