import { ReactNode, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

type NavigateAction = {
	name: string;
	path: string;
	icon?: ReactNode;
};

type OpenAction = {
	name: string;
	onClick: ((id: string) => void) | (() => void);
	icon?: ReactNode;
	id: string;
};

type Props = {
	openActionItems?: OpenAction[];
	navigateActionItems?: NavigateAction[];
	setDropdown: React.Dispatch<React.SetStateAction<boolean>>;
	listStyling?: string;
	itemStyling?: string;
};

const ActionDropdown = ({
	openActionItems,
	navigateActionItems,
	setDropdown,
	listStyling,
	itemStyling,
}: Props) => {
	const ref = useRef<HTMLUListElement>(null);

	const handleClickOutside = (event: MouseEvent) => {
		if (
			ref.current &&
			!ref.current.parentNode?.contains(event.target as Node)
		) {
			setDropdown(false);
		}
	};

	useEffect(() => {
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<ul
			ref={ref}
			className={
				listStyling ||
				"absolute z-10 right-4 top-4 w-48 bg-white border-2 text-gray-600 shadow-md rounded-md border-gray-100 p-2 mt-2"
			}>
			{navigateActionItems?.map((item, index) => {
				return (
					<li className='flex' key={index}>
						<Link
							to={item.path}
							className={
								itemStyling ||
								"flex items-center w-full px-2 py-1 gap-2 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800"
							}>
							{item.icon}
							<span>{item.name}</span>
						</Link>
					</li>
				);
			})}
			{openActionItems?.map((item, index) => {
				return (
					<li
						key={index}
						onClick={() => item.onClick(item.id)}
						className={
							itemStyling ||
							"flex items-center w-full px-2 py-1 gap-2 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800"
						}>
						{item.icon}
						{item.name}
					</li>
				);
			})}
		</ul>
	);
};

export default ActionDropdown;
