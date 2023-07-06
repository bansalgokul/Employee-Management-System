import { BiUser } from "react-icons/bi";
import { GoProject } from "react-icons/go";
import { FaTasks } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { User } from "../App";

type Props = {
	userInfo: User;
};

const Sidebar = ({ userInfo }: Props) => {
	return (
		<div className='col-start-1 col-span-1 row-start-2 row-end-11 bg-white shadow-md'>
			<ul className='flex flex-col h-full  text-base font-medium'>
				<li className='text-center py-4 flex flex-col items-center border-y border-collapse hover:border-l-[7px] hover:shadow-md hover:border-l-[#7E3AF2]'>
					<BiUser />
					<span>Profile</span>
				</li>
				<li className='text-center py-4 flex flex-col items-center border-y border-collapse hover:border-l-[7px] hover:shadow-md hover:border-l-[#7E3AF2]'>
					<FaTasks />
					<span>Tasks</span>
				</li>
				<li className='text-center py-4 flex flex-col items-center border-y border-collapse hover:border-l-[7px] hover:shadow-md hover:border-l-[#7E3AF2]'>
					<GoProject />
					<span>Projects</span>
				</li>
				{userInfo.roles === "admin" && (
					<li className='text-center py-4 flex flex-col items-center border-y border-collapse hover:border-l-[7px] hover:shadow-md hover:border-l-[#7E3AF2]'>
						<FiUsers />
						<span>Users</span>
					</li>
				)}
			</ul>
		</div>
	);
};

export default Sidebar;
