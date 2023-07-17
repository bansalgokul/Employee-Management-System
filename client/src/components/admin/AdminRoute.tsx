import { Navigate, Route, Routes } from "react-router-dom";
import DashLayout from "../Shared/DashLayout";
import UserView from "../features/user/admin/UserView";
import AdminTaskView from "../features/task/admin/AdminTaskView";
import { useEffect, useState } from "react";
import api from "../../api/api";
import AdminProjectView from "../features/project/admin/AdminProjectView";
import { Project, Task, User } from "../types";

type Props = {
	userInfo: User;
	taskList: Task[];
	setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
	projectList: Project[];
	setProjectList: React.Dispatch<React.SetStateAction<Project[]>>;
};

const AdminRoute = ({ userInfo, setTaskList, setProjectList }: Props) => {
	const [adminTaskList, setAdminTaskList] = useState<Task[]>([]);
	const [adminProjectList, setAdminProjectList] = useState<Project[]>([]);
	const [userList, setUserList] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);

		async function getData() {
			try {
				const taskResponse = await api.get("/admin/task");
				if (taskResponse.status === 200) {
					taskResponse.data.taskDocs =
						taskResponse.data.taskDocs.filter(
							(task: Task) => task.user !== null,
						);
					setAdminTaskList(taskResponse.data.taskDocs);
				}
				const projectResponse = await api.get("/admin/project");
				if (projectResponse.status === 200) {
					projectResponse.data.projectDocs.forEach(
						(project: Project) =>
							(project.assigned = project.assigned.filter(
								(p) => p.user?._id,
							)),
					);
					setAdminProjectList(projectResponse.data.projectDocs);
				}
				const userResponse = await api.get("/admin/user");
				if (userResponse.status === 200) {
					setUserList(userResponse.data.userDocs);
				}
				setLoading(false);
			} catch (error) {
				console.log("Error fetching Projects:", error);
			}
		}

		getData();
	}, []);

	useEffect(() => {
		setTaskList(() =>
			adminTaskList.filter((task) => task.user._id === userInfo._id),
		);
	}, [adminTaskList, setTaskList, userInfo._id]);

	useEffect(() => {
		setProjectList(() => {
			return adminProjectList.filter((p) =>
				p.assigned.find((user) => user.user?._id === userInfo._id),
			);
		});
	}, [adminProjectList, setProjectList, userInfo._id, userList]);

	if (userInfo.roles !== "admin") return <Navigate to='/' replace />;
	return (
		<>
			{!loading && (
				<Routes>
					<Route path='/' element={<DashLayout isAdmin={true} />}>
						<Route
							index
							element={
								<AdminTaskView
									taskList={adminTaskList}
									setTaskList={setAdminTaskList}
									projectList={adminProjectList}
									setProjectList={setAdminProjectList}
								/>
							}
						/>
						<Route
							path='project'
							element={
								<AdminProjectView
									userList={userList}
									setUserList={setUserList}
									taskList={adminTaskList}
									setTaskList={setAdminTaskList}
									projectList={adminProjectList}
									setProjectList={setAdminProjectList}
								/>
							}
						/>
						<Route
							path='user'
							element={
								<UserView
									userList={userList}
									setUserList={setUserList}
								/>
							}
						/>
					</Route>
				</Routes>
			)}
		</>
	);
};

export default AdminRoute;
