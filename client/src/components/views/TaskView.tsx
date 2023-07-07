/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import api from "../../api/api";
import { format } from "date-fns";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Project } from "./ProjectView";
import { User } from "../../App";

type Props = {
	isAdminView: boolean;
};

type Task = {
	_id: string;
	description: string;
	project: Project;
	user: User;
	startedAt: Date;
	endedAt: Date | undefined;
};

const TaskView = ({ isAdminView }: Props) => {
	const [taskList, setTaskList] = useState<Task[]>([]);
	const [isDropDownOpen, setIsDropDownOpen] = useState(false);

	useEffect(() => {
		async function getTasks() {
			try {
				const url = isAdminView ? "/admin/task" : "/task";
				const response = await api.get(url);
				if (response.status === 200) {
					setTaskList(response.data.taskDocs);
					console.log(response.data);
				}
			} catch (error) {
				console.log("Error fetching tasks:", error);
			}
		}

		getTasks();
	}, []);

	const handleEditClick = () => {
		console.log("Edit");
	};
	const handleDeleteClick = async (id: string) => {
		console.log("Delete");

		const response = await api.delete(`task/${id}`);
		if (response.status === 200) {
			taskList.filter((task) => task._id !== id);
		}
	};

	return (
		<div className='flex justify-center h-full px-4 w-full relative bg-white shadow-lg rounded-md p-4 '>
			<div className='flex flex-col gap-2 w-full h-full overflow-auto'>
				<div>
					<div className='flex justify-between w-full'>
						<div className='w-[20%] text-center'>Description</div>
						<div className='w-[25%] text-center'>Project</div>
						<div className='w-[20%] text-center'>User</div>
						<div className='w-[10%] text-center'>Start</div>
						<div className='w-[10%] text-center'>End</div>
						<div className='w-[10%] text-center'>Duration</div>
						<div className='w-[5%]'></div>
					</div>
				</div>
				<div className='flex flex-col border-b-4'>
					{/* <div className='py-4'>Date</div> */}
					{taskList.map((task) => {
						return (
							<div
								key={task._id}
								className='flex items-center justify-between w-full py-2 border-y'>
								<div className='w-[20%] text-center overflow-hidden'>
									{task.description}
								</div>
								<div className='w-[25%] text-center overflow-hidden'>
									{task.project.title}
								</div>
								<div className='w-[20%] text-center overflow-hidden'>
									{task.user.name}
								</div>
								<div className='w-[10%] text-center'>
									{format(
										new Date(task.startedAt),
										"h:mm aaa",
									)}
								</div>
								<div className='w-[10%] text-center'>
									{task.endedAt
										? format(
												new Date(task.endedAt),
												"h:mm aaa",
										  )
										: ""}
								</div>
								<div className='w-[10%] text-center'>
									{format(
										new Date(
											task.endedAt
												? new Date(
														task.endedAt,
												  ).getTime()
												: new Date().getTime() -
												  new Date(
														task.startedAt,
												  ).getTime(),
										),
										"h:mm",
									)}
								</div>

								<div
									className='w-[5%] flex justify-center items-center relative'
									onClick={() =>
										setIsDropDownOpen((prev) => !prev)
									}>
									<BsThreeDotsVertical />
									{isDropDownOpen && (
										<ul className='absolute z-10 right-6 top-6 w-48 bg-white border-2 text-gray-600 shadow-md rounded-md border-gray-100 p-2 mt-2'>
											<li
												onClick={handleEditClick}
												className='flex items-center w-full px-2 py-1 gap-2 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800'>
												Edit
											</li>
											<li
												onClick={() =>
													handleDeleteClick(task._id)
												}
												className='flex items-center w-full px-2 py-1 gap-2 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800'>
												Delete
											</li>
										</ul>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default TaskView;
