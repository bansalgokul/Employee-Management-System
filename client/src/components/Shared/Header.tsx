import Profile from "../../assets/21666259.jpg";
import { BiLogIn, BiLogOut, BiUser } from "react-icons/bi";
import { RiAdminLine } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { User } from "../types";
import ActionDropdown from "./ActionDropdown";
import api from "../../api/api";

type Props = {
	isLoggedIn: boolean;
	setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
	userInfo: User;
};

const Header = ({ isLoggedIn, userInfo, setIsLoggedIn }: Props) => {
	const [dropdown, setDropdown] = useState(false);
	const navigate = useNavigate();

	// Logout handling
	const handleLogout = async () => {
		await api.get("/auth/logout", {
			withCredentials: true,
		});
		localStorage.clear();
		setIsLoggedIn(false);
		navigate("/login");
	};

	// Action items for header dropdown
	const navigateActionItems = [
		{
			name: "Profile",
			path: "/profile",
			icon: <BiUser />,
		},
		{
			name: "Dashboard",
			path: "/",
			icon: <RxDashboard />,
		},
	];

	// Created outside dropdown component to selectively add admin option
	if (userInfo?.roles === "admin") {
		navigateActionItems.push({
			name: "Admin",
			path: "admin",
			icon: <RiAdminLine />,
		});
	}

	return (
		<div className='col-start-1 col-end-11 row-span-1 row-start-1 flex justify-between items-center px-8 py-3 text-gray-900 bg-white shadow-md relative'>
			<div>
				<Link to='/'>
					<h1 className='text-3xl font-bold'>UMS</h1>
				</Link>
			</div>

			<nav className=''>
				<ul className='flex items-center gap-2 hover:cursor-pointer'>
					{!isLoggedIn ? (
						<li className='flex items-center w-full px-2 py-1 gap-2'>
							<BiLogIn />
							Login
						</li>
					) : (
						<>
							<li className='text-md font-semibold'>
								Hi, {userInfo?.name}
							</li>
							<li
								className='relative'
								onClick={() => setDropdown((prev) => !prev)}>
								<img
									src={Profile}
									alt=''
									className='rounded-full w-10 h-10 p-1'
								/>
								{dropdown && (
									<ActionDropdown
										setDropdown={setDropdown}
										navigateActionItems={
											navigateActionItems
										}
										openActionItems={[
											{
												name: "Logout",
												id: "",
												onClick: handleLogout,
												icon: <BiLogOut />,
											},
										]}
										listStyling='absolute z-20 right-0 w-48 bg-white border-2 text-gray-600 shadow-md rounded-md border-gray-100 p-2 mt-2'
									/>
								)}
							</li>
						</>
					)}
				</ul>
			</nav>
		</div>
	);
};

export default Header;
