import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
	path: string;
	icon: ReactNode;
	name: string;
};

const SideBarItem = ({ path, icon, name }: Props) => {
	const navigate = useNavigate();

	return (
		<li
			className={` text-center py-4 flex flex-col items-center border-y border-collapse   ${
				window.location.pathname === path
					? "border-l-[7px] shadow-md border-l-[#3B71CA]"
					: "hover:shadow-sm hover:scale-[105%] hover:cursor-pointer"
			}`}
			onClick={() => navigate(path)}>
			{icon}
			<span>{name}</span>
		</li>
	);
};

export default SideBarItem;
