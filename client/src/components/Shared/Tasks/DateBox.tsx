import { Task } from "../../types";
import { getTasksTime } from "../duration";
import { useMemo } from "react";
import TaskBox from "./TaskBox";

type Props = {
	taskArray: Task[];
	date: string;
	handleDeleteClick: (id: string) => void;
	handleEditClick: (id: string) => void;
	isLocked?: boolean;
};

const DateBox = ({
	taskArray,
	date,
	handleDeleteClick,
	handleEditClick,
	isLocked = false,
}: Props) => {
	const { startTime, endTime, formatDuration } = useMemo(
		() => getTasksTime(taskArray),
		[taskArray],
	);

	return (
		<div>
			<div className=' font-semibold text-lg flex bg-[#f7f7f7]'>
				<div className='w-[20%] text-center'>{date}</div>
				<div className='w-[25%]'></div>
				<div className='w-[15%] text-center'>{startTime}</div>
				<div className='w-[15%] text-center'>{endTime}</div>
				<div className='w-[20%] text-center'>{formatDuration}</div>
			</div>
			{taskArray
				.sort((a, b) => (a.startedAt > b.startedAt ? -1 : 1))
				.map((task) => {
					return (
						<TaskBox
							key={task._id}
							task={task}
							isLocked={isLocked}
							handleDeleteClick={handleDeleteClick}
							handleEditClick={handleEditClick}
						/>
					);
				})}
		</div>
	);
};

export default DateBox;
