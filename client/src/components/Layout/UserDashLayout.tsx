import { Outlet } from "react-router-dom";
import { User } from "../../App";
import Sidebar from "../Sidebar";

type Props = {
	userInfo: User;
};

const UserDashLayout = ({ userInfo }: Props) => {
	return (
		<>
			<Sidebar userInfo={userInfo} />
			<Outlet />
		</>
	);
};

export default UserDashLayout;
