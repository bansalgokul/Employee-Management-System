import { Route, Routes, useNavigate } from "react-router-dom";

import HomeView from "./Home View/HomeView";
import DashLayout from "../Shared/DashLayout";
import ProfileView from "../features/user/employee/ProfileView";
import TaskView from "../features/task/employee/TaskView";
import ProjectView from "../features/project/employee/ProjectView";
import AdminRoute from "../admin/AdminRoute";
import { User } from "../types";

type Props = {
	isLoggedIn: boolean;
	userInfo: User;
};

const UserRoute = ({ isLoggedIn, userInfo }: Props) => {
	const navigate = useNavigate();

	if (!isLoggedIn) {
		navigate("/login");
	}

	return (
		<Routes>
			<Route path='/' element={<DashLayout isAdmin={false} />}>
				<Route index element={<HomeView />} />
				<Route
					path='profile'
					element={<ProfileView userInfo={userInfo} />}
				/>
				<Route path='task' element={<TaskView />} />
				<Route path='project' element={<ProjectView />} />
			</Route>
			<Route
				path='admin/*'
				element={<AdminRoute userInfo={userInfo} />}
			/>
		</Routes>
	);
};

export default UserRoute;
