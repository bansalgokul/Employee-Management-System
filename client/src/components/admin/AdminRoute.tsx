import { Navigate, Outlet } from "react-router-dom";
import { User } from "../../App";

type Props = {
	userInfo: User;
};

const AdminRoute = ({ userInfo }: Props) => {
	console.log(userInfo);
	if (userInfo.roles !== "admin") return <Navigate to='/' replace />;
	return <Outlet />;
};

export default AdminRoute;
