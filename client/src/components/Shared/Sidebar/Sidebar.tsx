import { BiHomeAlt2, BiUser } from "react-icons/bi";
import { GoProject } from "react-icons/go";
import { FaTasks } from "react-icons/fa";
import SideBarItem from "./SideBarItem";
import { FiUsers } from "react-icons/fi";

type Props = {
	isAdmin: boolean;
};

const Sidebar = ({ isAdmin }: Props) => {
	return (
		<div className='col-start-1 col-span-1 row-start-2 row-end-11 bg-white shadow-md'>
			<ul className='flex flex-col h-full  text-base font-medium '>
				{isAdmin ? (
					<>
						<SideBarItem
							path='/admin'
							icon={<FaTasks />}
							name='Tasks'
						/>
						<SideBarItem
							path='/admin/project'
							icon={<GoProject />}
							name='Projects'
						/>
						<SideBarItem
							path='/admin/user'
							icon={<FiUsers />}
							name='Users'
						/>
					</>
				) : (
					<>
						<SideBarItem
							path='/'
							icon={<BiHomeAlt2 />}
							name='Home'
						/>
						<SideBarItem
							path='/task'
							icon={<FaTasks />}
							name='Tasks'
						/>
						<SideBarItem
							path='/project'
							icon={<GoProject />}
							name='Projects'
						/>
						<SideBarItem
							path='/profile'
							icon={<BiUser />}
							name='Profile'
						/>
					</>
				)}
			</ul>
		</div>
	);
};

export default Sidebar;
