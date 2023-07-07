import { GoProject } from "react-icons/go";
import { FaTasks } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdminSidebar = () => {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		// console.log(location);
	}, [location]);

	return (
		<div className='col-start-1 col-span-1 row-start-2 row-end-11 bg-white shadow-md'>
			<ul className='flex flex-col h-full  text-base font-medium'>
				<li
					className={`text-center py-4 flex flex-col items-center border-y border-collapse  hover:shadow-md + ${
						location.pathname === "/admin"
							? "border-l-[7px] shadow-md border-l-[#3B71CA]"
							: ""
					}`}
					onClick={() => navigate("/admin")}>
					<FaTasks />
					<span>Tasks</span>
				</li>
				<li
					className={`text-center py-4 flex flex-col items-center border-y border-collapse hover:shadow-md + ${
						location.pathname === "/admin/project"
							? "border-l-[7px] shadow-md border-l-[#3B71CA]"
							: ""
					}`}
					onClick={() => navigate("/admin/project")}>
					<GoProject />
					<span>Projects</span>
				</li>

				<li
					className={`text-center py-4 flex flex-col items-center border-y border-collapse hover:shadow-md  + ${
						location.pathname === "/admin/user"
							? "border-l-[7px] shadow-md border-l-[#3B71CA]"
							: ""
					}`}
					onClick={() => navigate("/admin/user")}>
					<FiUsers />
					<span>Users</span>
				</li>
			</ul>
		</div>
	);
};

export default AdminSidebar;
