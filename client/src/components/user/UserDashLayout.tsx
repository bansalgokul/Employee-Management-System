import { Outlet } from "react-router-dom";
import { User } from "../../App";
import UserSidebar from "./UserSidebar";

type Props = {
	userInfo: User;
};

const UserDashLayout = ({ userInfo }: Props) => {
	return (
		<>
			<UserSidebar />
			<div className='col-start-2 col-end-11 row-start-2 row-end-11 p-6'>
				<Outlet />
			</div>
		</>
	);
};

export default UserDashLayout;
