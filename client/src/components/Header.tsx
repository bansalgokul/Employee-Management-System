import Profile from "../assets/21666259.jpg";
import { BiLogIn, BiLogOut, BiUser } from "react-icons/bi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { RiAdminLine } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../App";
import { useEffect, useRef, useState } from "react";

type Props = {
	isLoggedIn: boolean;
	setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
	userInfo: User | undefined;
};

const Header = ({ isLoggedIn, userInfo, setIsLoggedIn }: Props) => {
	const [isDropDownOpen, setIsDropDownOpen] = useState(false);
	const navigate = useNavigate();
	const ref = useRef<HTMLLIElement>(null);

	const handleLogout = () => {
		localStorage.clear();
		setIsLoggedIn(false);
		navigate("/login");
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (ref.current && ref.current.contains(event.target as Node)) {
			setIsDropDownOpen((prev) => !prev);
		} else {
			setIsDropDownOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

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
						<li className='relative' ref={ref}>
							<img
								src={Profile}
								alt=''
								className='rounded-full w-10 h-10 p-1'
							/>
							{isDropDownOpen && (
								<ul className='absolute z-20 right-0 w-48 bg-white border-2 text-gray-600 shadow-md rounded-md border-gray-100 p-2 mt-2'>
									<li className='flex'>
										<Link
											to='/profile'
											className='flex items-center w-full px-2 py-1 gap-2 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800'>
											<BiUser />
											<span>Profile</span>
										</Link>
									</li>
									<li className='flex'>
										<Link
											to='/'
											className='flex gap-2 items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800'>
											<RxDashboard />
											<span>Dashboard</span>
										</Link>
									</li>
									{userInfo?.roles === "admin" && (
										<li className='flex'>
											<Link
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
