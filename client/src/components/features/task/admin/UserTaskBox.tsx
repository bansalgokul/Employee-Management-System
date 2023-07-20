import { format } from "date-fns";
import { Task } from "../../../types";
import ActionDropdown from "../../../Shared/ActionDropdown";
import { BsThreeDotsVertical } from "react-icons/bs";
import { getDuration } from "../../../Shared/duration";
import { useMemo, useState } from "react";
type Props = {
	task: Task;
	handleEditClick: (id: string) => void;
	handleDeleteClick: (id: string) => void;
};

const UserTaskBox = ({ task, handleEditClick, handleDeleteClick }: Props) => {
	const duration = useMemo(
		() => getDuration(task.startedAt, task.endedAt).formatTimeHM,
		[task.startedAt, task.endedAt],
	);
	const [dropdown, setDropdown] = useState(false);

	return (
		<div className='flex items-center justify-between w-full py-2 border-b'>
			<div className='w-[15%] text-center overflow-hidden'>
				{task.project.title}
			</div>
			<div className='w-[20%] text-center overflow-hidden'>
				{task.description}
			</div>
			<div className='w-[20%] text-center'>
				{format(new Date(task.startedAt), "dd-MM-yyyy")}
			</div>
			<div className='w-[15%] text-center'>
				{format(new Date(task.endedAt), "HH:mm aaa")}
			</div>
			<div className='w-[15%] text-center'>
				{format(new Date(task.endedAt), "HH:mm aaa")}
			</div>
			<div className='w-[10%] text-center'>{duration}</div>
			<div
				className='w-[5%] text-center flex justify-center items-center relative hover:cursor-pointer'
				onClick={() => {
					setDropdown((prev) => !prev);
				}}>
				<BsThreeDotsVertical />
				{dropdown && (
					<ActionDropdown
						openActionItems={[
							{
								name: "Edit",
								id: task._id,
								onClick: handleEditClick,
							},
							{
								name: "Delete",
								id: task._id,
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

export default UserTaskBox;
