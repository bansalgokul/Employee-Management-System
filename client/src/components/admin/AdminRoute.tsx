import { Navigate, Route, Routes } from "react-router-dom";
import DashLayout from "../Shared/DashLayout";
import UserView from "../features/user/admin/UserView";
import AdminTaskView from "../features/task/admin/AdminTaskView";
import AdminProjectView from "../features/project/admin/AdminProjectView";
import { User } from "../types";

type Props = {
	userInfo: User;
};

const AdminRoute = ({ userInfo }: Props) => {
	// const deleteUser = () => {};

	if (userInfo.roles !== "admin") return <Navigate to='/' replace />;
	return (
		<Routes>
			<Route path='/' element={<DashLayout isAdmin={true} />}>
				<Route index element={<AdminTaskView />} />
				<Route path='project' element={<AdminProjectView />} />
				<Route path='user' element={<UserView />} />
			</Route>
		</Routes>
	);
};

export default AdminRoute;
