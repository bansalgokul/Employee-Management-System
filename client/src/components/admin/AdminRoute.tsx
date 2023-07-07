import { Navigate, Outlet } from "react-router-dom";
import { User } from "../../App";
import AdminSidebar from "./AdminSidebar";

type Props = {
	userInfo: User;
};

const AdminRoute = ({ userInfo }: Props) => {
	console.log(userInfo);
	if (userInfo.roles !== "admin") return <Navigate to='/' replace />;
	return (
		<>
			<AdminSidebar />
			<div className='col-start-2 col-end-11 row-start-2 row-end-11 p-6'>
				<Outlet />
			</div>
		</>
	);
};

export default AdminRoute;
