import { BiUser } from "react-icons/bi";
import { GoProject } from "react-icons/go";
import { FaTasks } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { User } from "../../App";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const UserSidebar = () => {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		console.log(location);
	}, [location]);

	return (
		<div className='col-start-1 col-span-1 row-start-2 row-end-11 bg-white shadow-md'>
			<ul className='flex flex-col h-full  text-base font-medium'>
				<li
					className={`text-center py-4 flex flex-col items-center border-y border-collapse hover:shadow-md + ${
						location.pathname === "/dash"
							? "border-l-[7px] shadow-md border-l-[#3B71CA]"
							: ""
					}`}
					onClick={() => navigate("/dash")}>
					<BiUser />
					<span>Profile</span>
				</li>
				<li
					className={`text-center py-4 flex flex-col items-center border-y border-collapse  hover:shadow-md + ${
						location.pathname === "/dash/task"
							? "border-l-[7px] shadow-md border-l-[#3B71CA]"
							: ""
					}`}
					onClick={() => navigate("/dash/task")}>
					<FaTasks />
					<span>Tasks</span>
				</li>
				<li
					className={`text-center py-4 flex flex-col items-center border-y border-collapse hover:shadow-md + ${
						location.pathname === "/dash/project"
							? "border-l-[7px] shadow-md border-l-[#3B71CA]"
							: ""
					}`}
					onClick={() => navigate("/dash/project")}>
					<GoProject />
					<span>Projects</span>
				</li>
				{/* {isAdminDash && (
					<li
						className={`text-center py-4 flex flex-col items-center border-y border-collapse hover:shadow-md  + ${
							location.pathname === "/dash/user"
								? "border-l-[7px] shadow-md border-l-[#3B71CA]"
								: ""
						}`}>
						<FiUsers />
						<span>Users</span>
					</li>
				)} */}
			</ul>
		</div>
	);
};

export default UserSidebar;
