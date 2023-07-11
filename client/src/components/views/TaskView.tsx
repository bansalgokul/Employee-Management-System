/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import api from "../../api/api";
import { format } from "date-fns";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Project, Task } from "../user/UserRoute";
import { BiLock } from "react-icons/bi";
import EditTask from "./EditTask";

type Props = {
	taskList: Task[];
	setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
	projectList: Project[];
};

const TaskView = ({ taskList, setTaskList, projectList }: Props) => {
	const [isDropDownOpen, setIsDropDownOpen] = useState<string | null>(null);
	const [isEditorOpen, setIsEditorOpen] = useState<Task | null>(null);

	const handleEditClick = (id: string) => {
		const task = taskList.find((task) => task._id === id);
		if (task) {
			setIsEditorOpen(task);
		}
	};
	const handleDeleteClick = async (id: string) => {
		const url = `/task/${id}`;
		const response = await api.delete(url);
		if (response.status === 200) {
			setTaskList(taskList.filter((task) => task._id !== id));
		}
	};

	const groupTasksByDate = () => {
		const groupedTasks: {
			[key: string]: {
				taskArray: Task[];
				duration: number;
				startTime: Date;
				endTime: Date;
			};
		} = {};

		taskList.forEach((task) => {
			const date = format(new Date(task.startedAt), "yyyy-MM-dd");
			if (!groupedTasks[date]) {
				groupedTasks[date] = {
					taskArray: [],
					duration: 0,
					startTime: new Date(),
					endTime: new Date(0),
				};
			}
			groupedTasks[date].taskArray.push(task);
			const durationInMilliseconds =
				new Date(task.endedAt).getTime() -
				new Date(task.startedAt).getTime();
			groupedTasks[date].duration += durationInMilliseconds;
			groupedTasks[date].startTime =
				groupedTasks[date].startTime < task.startedAt
					? groupedTasks[date].startTime
					: task.startedAt;
			groupedTasks[date].endTime =
				groupedTasks[date].endTime > task.endedAt
					? groupedTasks[date].endTime
					: task.endedAt;
		});

		return groupedTasks;
	};

	const [groupedTasks, setGroupedTasks] = useState(groupTasksByDate);

	useEffect(() => {
		setGroupedTasks(groupTasksByDate);
		console.log("setting grouped tasks");
	}, [taskList]);

	return (
		<div className='flex justify-center h-full px-4 w-full flex-grow relative bg-white shadow-lg rounded-md p-4 '>
			<div className='flex flex-col gap-2 w-full h-full overflow-auto no-scrollbar pt-12'>
				{isEditorOpen && (
					<EditTask
						task={isEditorOpen}
						setIsEditorOpen={setIsEditorOpen}
						projectList={projectList}
						taskList={taskList}
						setTaskList={setTaskList}
						isAdminView={false}
					/>
				)}
				<div className='flex justify-between w-full absolute top-0 left-0 z-10 bg-white p-4 border-b-2'>
					<div className='w-[20%] text-center'>Description</div>
					<div className='w-[25%] text-center'>Project</div>
					<div className='w-[15%] text-center'>Start</div>
					<div className='w-[15%] text-center'>End</div>
					<div className='w-[20%] text-center'>Duration</div>
					<div className='w-[5%]'></div>
				</div>

				<div className='flex flex-col border-b-4'>
					{Object.entries(groupedTasks)
						.sort((a, b) => (a[0] > b[0] ? -1 : 1))
						.map(
							([
								date,
								{ taskArray, startTime, endTime, duration },
							]) => {
								const minutes =
									Math.floor(duration / (1000 * 60)) % 60;
								const hours =
									Math.floor(duration / (1000 * 60 * 60)) %
									24;
								return (
									<div key={date}>
										<div className=' font-semibold text-lg flex bg-[#f0f0f0]'>
											<div className='w-[20%] text-center'>
												{date}
											</div>
											<div className='w-[25%]'></div>
											<div className='w-[15%] text-center'>
												{format(
													new Date(startTime),
													"h:mm aaa",
												)}
											</div>
											<div className='w-[15%] text-center'>
												{format(
													new Date(endTime),
													"h:mm aaa",
												)}
											</div>
											<div className='w-[20%] text-center'>{`${hours
												.toString()
												.padStart(2, "0")}:${minutes
												.toString()
												.padStart(2, "0")}`}</div>
										</div>
										{taskArray
											.sort((a, b) =>
												a.startedAt > b.startedAt
													? -1
													: 1,
											)
											.map((task) => {
												const durationInMilliseconds =
													new Date(
														task.endedAt,
													).getTime() -
													new Date(
														task.startedAt,
													).getTime();

												const minutes =
													Math.floor(
														durationInMilliseconds /
															(1000 * 60),
													) % 60;
												const hours =
													Math.floor(
														durationInMilliseconds /
															(1000 * 60 * 60),
													) % 24;

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

														<div className='w-[15%] text-center'>
															{format(
																new Date(
																	task.startedAt,
																),
																"h:mm aaa",
															)}
														</div>
														<div className='w-[15%] text-center'>
															{format(
																new Date(
																	task.endedAt,
																),
																"h:mm aaa",
															)}
														</div>
														<div className='w-[20%] text-center'>
															{`${hours
																.toString()
																.padStart(
																	2,
																	"0",
																)}:${minutes
																.toString()
																.padStart(
																	2,
																	"0",
																)}`}
														</div>

														{date ===
														format(
															new Date(),
															"yyyy-MM-dd",
														) ? (
															<div
																className='w-[5%] flex justify-center items-center relative hover:cursor-pointer'
																onClick={() =>
																	setIsDropDownOpen(
																		(
																			prev,
																		) =>
																			prev ===
																			task._id
																				? null
																				: task._id,
																	)
																}>
																<BsThreeDotsVertical />
																{isDropDownOpen ===
																	task._id && (
																	<ul className='absolute z-10 right-6 top-6 w-48 bg-white border-2 text-gray-600 shadow-md rounded-md border-gray-100 p-2 mt-2'>
																		<li
																			onClick={() =>
																				handleEditClick(
																					task._id,
																				)
																			}
																			className='flex items-center w-full px-2 py-1 gap-2 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800'>
																			Edit
																		</li>
																		<li
																			onClick={() =>
																				handleDeleteClick(
																					task._id,
																				)
																			}
																			className='flex items-center w-full px-2 py-1 gap-2 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800'>
																			Delete
																		</li>
																	</ul>
																)}
															</div>
														) : (
															<div className='w-[5%] flex justify-center items-center relative '>
																<BiLock />
															</div>
														)}
													</div>
												);
											})}
									</div>
								);
							},
						)}
				</div>
			</div>
		</div>
	);
};

export default TaskView;
