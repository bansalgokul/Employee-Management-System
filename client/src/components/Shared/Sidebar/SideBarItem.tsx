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
			className={` text-center py-4 md:grow-0 grow flex md:flex-col gap-2 items-center justify-center border-y border-collapse   ${
				window.location.pathname === path
					? "md:border-l-[7px] md:border-b-0 border-b-[7px] shadow-md md:border-l-[#3B71CA] border-b-[#3B71CA]"
					: "hover:shadow-sm hover:scale-[105%] hover:cursor-pointer"
			}`}
			onClick={() => navigate(path)}>
			{icon}
			<span>{name}</span>
		</li>
	);
};

export default SideBarItem;
