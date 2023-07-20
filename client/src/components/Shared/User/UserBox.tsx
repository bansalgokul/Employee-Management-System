import { BsThreeDotsVertical } from "react-icons/bs";
import ActionDropdown from "../ActionDropdown";
import { User } from "../../types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
	user: User;
	handleEditClick: (id: string) => void;
	handleDeleteClick: (id: string) => void;
};

const UserBox = ({ user, handleEditClick, handleDeleteClick }: Props) => {
	const navigate = useNavigate();
	const handleViewClick = (id: string) => {
		const url = `/admin/?target=${id}`;
		navigate(url);
	};

	const [dropdown, setDropdown] = useState(false);

	return (
		<div className='flex justify-between items-center w-full py-2 border-y'>
			<div className='w-[320px]'>{user.name}</div>
			<div className='w-[250px] text-center'>{user.email}</div>
			<div className='w-[180px] text-center'>{user.empID}</div>
			<div className='w-[180px] text-center'>{user.roles}</div>
			<div
				className='w-[5%] flex justify-center items-center relative hover:cursor-pointer'
				onClick={() => {
					setDropdown((prev) => !prev);
				}}>
				<BsThreeDotsVertical />
				{dropdown && (
					<ActionDropdown
						openActionItems={[
							{
								name: "View Tasks",
								id: user._id,
								onClick: handleViewClick,
							},
							{
								name: "Edit",
								id: user._id,
								onClick: handleEditClick,
							},
							{
								name: "Delete",
								id: user._id,
								onClick: handleDeleteClick,
							},
						]}
						setDropdown={setDropdown}
					/>
				)}
			</div>
		</div>
	);
};

export default UserBox;
