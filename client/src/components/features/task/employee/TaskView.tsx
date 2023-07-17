/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import api from "../../../../api/api";
import { format } from "date-fns";
import EditTask from "../EditTask";
import { Project, Task } from "../../../types";
import Loading from "../../../Shared/Loading";
import DateBox from "../../../Shared/Tasks/DateBox";

type Props = {
	taskList: Task[];
	setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
	projectList: Project[];
	setProjectList: React.Dispatch<React.SetStateAction<Project[]>>;
};

type GroupedTasksDate = {
	date: string;
	taskArray: Task[];
}[];

const TaskView = ({
	taskList,
	setTaskList,
	projectList,
	setProjectList,
}: Props) => {
	const [isEditorOpen, setIsEditorOpen] = useState<Task | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);

		async function getData() {
			try {
				const taskResponse = await api.get("/task");
				if (taskResponse.status === 200) {
					taskResponse.data.taskDocs =
						taskResponse.data.taskDocs.filter(
							(task: Task) =>
								task.user !== null && task.project !== null,
						);
					setTaskList(taskResponse.data.taskDocs);
				}

				setLoading(false);
			} catch (error) {
				console.log("Error fetching Projects:", error);
			}
		}

		getData();
	}, []);

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
		const groupedTasks: GroupedTasksDate = [];

		taskList.forEach((task) => {
			const date = format(new Date(task.startedAt), "dd-MM-yyyy");
			if (!groupedTasks.find((group) => group.date === date)) {
				groupedTasks.push({
					taskArray: [],
					date,
				});
			}
			groupedTasks
				.find((group) => group.date === date)
				?.taskArray.push(task);
		});

		return groupedTasks;
	};

	const [groupedTasks, setGroupedTasks] = useState(groupTasksByDate);

	useEffect(() => {
		setGroupedTasks(groupTasksByDate);
		console.log("setting grouped tasks");
	}, [taskList]);

	return (
		<div className='flex justify-center h-full px-2 w-full flex-grow relative bg-white shadow-lg rounded-md '>
			{loading ? (
				<Loading />
			) : (
				<div className='flex flex-col gap-2 w-full h-full'>
					{isEditorOpen && (
						<EditTask
							task={isEditorOpen}
							setIsEditorOpen={setIsEditorOpen}
							projectList={projectList}
							taskList={taskList}
							setTaskList={setTaskList}
							setProjectList={setProjectList}
							isAdminView={false}
						/>
					)}
					<div className='flex justify-between w-full  bg-white p-4 border-b-2'>
						<div className='w-[20%] text-center'>Description</div>
						<div className='w-[25%] text-center'>Project</div>
						<div className='w-[15%] text-center'>Start</div>
						<div className='w-[15%] text-center'>End</div>
						<div className='w-[20%] text-center'>Duration</div>
						<div className='w-[5%]'></div>
					</div>

					<div className='flex flex-col border-b-4 overflow-auto no-scrollbar'>
						{groupedTasks
							.sort((a, b) => (a.date > b.date ? -1 : 1))
							.map(({ date, taskArray }, index) => {
								return (
									<DateBox
										key={index}
										date={date}
										isLocked={
											date !==
											format(new Date(), "dd-MM-yyyy")
										}
										taskArray={taskArray}
										handleDeleteClick={handleDeleteClick}
										handleEditClick={handleEditClick}
									/>
								);
							})}
					</div>
				</div>
			)}
		</div>
	);
};

export default TaskView;