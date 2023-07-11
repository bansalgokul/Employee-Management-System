import { Navigate, Route, Routes } from "react-router-dom";
import { User } from "../../App";
import TaskView from "../views/TaskView";
import ProjectView from "../views/ProjectView";
import AdminDashLayout from "./AdminDashLayout";
import UserView from "../views/UserView";
import { Project, Task } from "../user/UserRoute";
import AdminTaskView from "../views/AdminTaskView";
import { useEffect, useState } from "react";
import api from "../../api/api";
import AdminProjectView from "../views/AdminProjectView";

type Props = {
	userInfo: User;
	taskList: Task[];
	setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
	projectList: Project[];
	setProjectList: React.Dispatch<React.SetStateAction<Project[]>>;
};

const AdminRoute = ({
	userInfo,
	// taskList,
	setTaskList,
	// projectList,
	setProjectList,
}: Props) => {
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
					setAdminTaskList(taskResponse.data.taskDocs);
				}
				const projectResponse = await api.get("/admin/project");
				if (projectResponse.status === 200) {
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
		setProjectList(() =>
			adminProjectList.filter((p) =>
				p.assigned.find((user) => user.user._id === userInfo._id),
			),
		);
	}, [adminProjectList, setProjectList, userInfo._id]);

	if (userInfo.roles !== "admin") return <Navigate to='/' replace />;
	return (
		<>
			{!loading && (
				<Routes>
					<Route path='/' element={<AdminDashLayout />}>
						<Route
							index
							element={
								<AdminTaskView
									taskList={adminTaskList}
									setTaskList={setAdminTaskList}
									projectList={adminProjectList}
								/>
							}
						/>
						<Route
							path='project'
							element={
								<AdminProjectView
									userList={userList}
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
