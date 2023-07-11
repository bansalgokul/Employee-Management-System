import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";

const UserDashLayout = () => {
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
