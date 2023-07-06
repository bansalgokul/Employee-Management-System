import { Navigate, Outlet } from "react-router-dom";

type Props = {
	isLoggedIn: boolean;
};

const UserRoute = ({ isLoggedIn }: Props) => {
	console.log("in user route - ", isLoggedIn);
	if (!isLoggedIn) return <Navigate to='/login' replace />;
	return <Outlet />;
};

export default UserRoute;
