import { BiHomeAlt2, BiUser } from "react-icons/bi";
import { GoProject } from "react-icons/go";
import { FaTasks } from "react-icons/fa";
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
						location.pathname === "/"
							? "border-l-[7px] shadow-md border-l-[#3B71CA]"
							: ""
					}`}
					onClick={() => navigate("/")}>
					<BiHomeAlt2 />
					<span>Home</span>
				</li>
				<li
					className={`text-center py-4 flex flex-col items-center border-y border-collapse  hover:shadow-md + ${
						location.pathname === "/task"
							? "border-l-[7px] shadow-md border-l-[#3B71CA]"
							: ""
					}`}
					onClick={() => navigate("/task")}>
					<FaTasks />
					<span>Tasks</span>
				</li>
				<li
					className={`text-center py-4 flex flex-col items-center border-y border-collapse hover:shadow-md + ${
						location.pathname === "/project"
							? "border-l-[7px] shadow-md border-l-[#3B71CA]"
							: ""
					}`}
					onClick={() => navigate("/project")}>
					<GoProject />
					<span>Projects</span>
				</li>
				<li
					className={`text-center py-4 flex flex-col items-center border-y border-collapse hover:shadow-md + ${
						location.pathname === "/profile"
							? "border-l-[7px] shadow-md border-l-[#3B71CA]"
							: ""
					}`}
					onClick={() => navigate("/profile")}>
					<BiUser />
					<span>Profile</span>
				</li>
			</ul>
		</div>
	);
};

export default UserSidebar;
