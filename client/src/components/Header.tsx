import Profile from "../assets/21666259.jpg";
import { BiLogIn, BiLogOut, BiUser } from "react-icons/bi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { RiAdminLine } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../App";
import { useEffect, useState } from "react";

type Props = {
	isLoggedIn: boolean;
	setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
	userInfo: User | undefined;
};

const Header = ({ isLoggedIn, userInfo, setIsLoggedIn }: Props) => {
	const [isDropDownOpen, setIsDropDownOpen] = useState(false);
	const navigate = useNavigate();

	const handleToggleDropdown = () => {
		setIsDropDownOpen((prev) => !prev);
	};

	const handleLogout = () => {
		localStorage.clear();
		setIsLoggedIn(false);
		handleToggleDropdown();
		navigate("/login");
	};

	return (
		<div className='col-start-1 col-end-11 row-span-1 row-start-1 flex justify-between items-center px-8 py-3 text-gray-900 bg-white shadow-md relative'>
			<div>
				<Link to='/'>
					<h1 className='text-3xl font-bold'>UMS</h1>
				</Link>
			</div>

			{!isLoggedIn ? (
				<nav>
					<ul className='flex text-md font-semibold'>
						<li className='flex items-center w-full px-2 py-1 gap-2'>
							<BiLogIn />
							Login
						</li>
					</ul>
				</nav>
			) : (
				<nav className=''>
					<ul className='flex items-center gap-2'>
						<li className='text-md font-semibold'>
							Hi, {userInfo?.name}
						</li>
						<li className='relative'>
							<img
								src={Profile}
								alt=''
								className='rounded-full w-10 h-10 p-1'
								onClick={handleToggleDropdown}
							/>
							{isDropDownOpen && (
								<ul className='absolute z-10 right-0 w-48 bg-white border-2 text-gray-600 shadow-md rounded-md border-gray-100 p-2 mt-2'>
									<li className='flex'>
										<Link
											onClick={handleToggleDropdown}
											to='/dash'
											className='flex items-center w-full px-2 py-1 gap-2 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800'>
											<BiUser />
											<span>Profile</span>
										</Link>
									</li>
									<li className='flex'>
										<Link
											onClick={handleToggleDropdown}
											to='/dash/task'
											className='flex gap-2 items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800'>
											<RxDashboard />
											<span>Dashboard</span>
										</Link>
									</li>
									{userInfo?.roles === "admin" && (
										<li className='flex'>
											<Link
												onClick={handleToggleDropdown}
												to='/admin'
												className='flex gap-2 items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800'>
												<RiAdminLine />
												<span>Admin</span>
											</Link>
										</li>
									)}

									<li className='flex'>
										<button
											onClick={handleLogout}
											className='flex gap-2 items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800'>
											<BiLogOut />
											<span>Logout</span>
										</button>
									</li>
								</ul>
							)}
						</li>
					</ul>
				</nav>
			)}
		</div>
	);
};

export default Header;
