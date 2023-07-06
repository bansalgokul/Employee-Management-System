import { Outlet } from "react-router-dom";
import { User } from "../../App";
import Sidebar from "../Sidebar";

type Props = {
	userInfo: User;
};

const UserDashLayout = ({ userInfo }: Props) => {
	return (
		<div>
			<Sidebar userInfo={userInfo} />
			<Outlet />
		</div>
	);
};

export default UserDashLayout;
