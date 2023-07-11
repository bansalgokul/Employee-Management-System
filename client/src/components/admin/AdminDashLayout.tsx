import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminDashLayout = () => {
	return (
		<>
			<AdminSidebar />
			<div className='col-start-2 col-end-11 row-start-2 row-end-11 p-6'>
				<Outlet />
			</div>
		</>
	);
};

export default AdminDashLayout;
