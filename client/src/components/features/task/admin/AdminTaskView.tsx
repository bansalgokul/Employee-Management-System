import React from "react";

/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import api from "../../../../api/api";
import { format } from "date-fns";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import EditTask from "../EditTask";
import { Link, useLocation } from "react-router-dom";
import { Project, Task, User } from "../../../types";
import Loading from "../../../Shared/Loading";

import DateBox from "../../../Shared/Tasks/DateBox";

type Props = {
	taskList: Task[];
	setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
	projectList: Project[];
	setProjectList: React.Dispatch<React.SetStateAction<Project[]>>;
};

type GroupedTasksUser = {
	user: User;
	GroupedTasksDate: {
		date: string;
		taskArray: Task[];
	}[];
};

const AdminTaskView = ({
	taskList,
	setProjectList,
	setTaskList,
	projectList,
}: Props) => {
	const location = useLocation();
	const [userListOpen, setUserListOpen] = useState<string | null>(null);
	const [isEditorOpen, setIsEditorOpen] = useState<Task | null>(null);

	const userID = new URLSearchParams(location.search).get("target");
	const projectID = new URLSearchParams(location.search).get("ref");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);

		async function getData() {
			try {
				const taskResponse = await api.get("/admin/task");
				if (taskResponse.status === 200) {
					taskResponse.data.taskDocs =
						taskResponse.data.taskDocs.filter(
							(task: Task) => task.user !== null,
						);
					setTaskList(taskResponse.data.taskDocs);
				}
				setLoading(false);
			} catch (error) {
				console.log("Error fetching Projects:", error);
			}
		}

		getData();
		setUserListOpen(userID);
	}, []);

	const handleEditClick = (id: string) => {
		const task = taskList.find((task) => task._id === id);
		if (task) {
			setIsEditorOpen(task);
		}
	};
	const handleDeleteClick = async (id: string) => {
		const url = `admin/task/${id}`;
		const response = await api.delete(url);
		if (response.status === 200) {
			setTaskList(taskList.filter((task) => task._id !== id));
		}
	};

	const groupTasksByUser = () => {
		const groupedTasksUser: {
			[key: string]: GroupedTasksUser;
		} = {};

		taskList.forEach((task) => {
			const user = task.user._id;
			const date = format(new Date(task.startedAt), "dd-MM-yyyy");
			if (!groupedTasksUser[user]) {
				groupedTasksUser[user] = {
					user: task.user,
					GroupedTasksDate: [],
				};
			}
			if (
				!groupedTasksUser[user].GroupedTasksDate.find(
					(group) => group.date === date,
				)
			) {
				groupedTasksUser[user].GroupedTasksDate.push({
					taskArray: [],
					date,
				});
			}

			groupedTasksUser[user].GroupedTasksDate.find(
				(group) => group.date === date,
			)?.taskArray.push(task);
		});

		return groupedTasksUser;
	};

	const [groupedTasksUser, setGroupedTasksUser] = useState(
		groupTasksByUser(),
	);

	useEffect(() => {
		setGroupedTasksUser(groupTasksByUser());
	}, [taskList]);

	return (
		<div className='flex justify-center h-full px-4 w-full flex-grow relative bg-white shadow-lg rounded-md p-4 '>
			{loading ? (
				<Loading />
			) : (
				<div className='flex flex-col gap-2 w-full h-full overflow-auto no-scrollbar pt-12'>
					{isEditorOpen && (
						<EditTask
							task={isEditorOpen}
							setIsEditorOpen={setIsEditorOpen}
							projectList={projectList}
							setProjectList={setProjectList}
							taskList={taskList}
							setTaskList={setTaskList}
							isAdminView={true}
						/>
					)}
					{projectID && (
						<Link to={`project/?target=${projectID}`}>Back</Link>
					)}
					<div className='flex justify-between w-full absolute top-0 left-0 z-10 bg-white p-4 border-b-2'>
						<div className='w-[20%] text-center'>Description</div>
						<div className='w-[25%] text-center'>Project</div>
						<div className='w-[15%] text-center'>Start</div>
						<div className='w-[15%] text-center'>End</div>
						<div className='w-[20%] text-center'>Duration</div>
						<div className='w-[5%]'></div>
					</div>

					<div className='flex flex-col border-b-4 gap-2'>
						{Object.entries(groupedTasksUser)
							.sort((a, b) => (a[0] > b[0] ? -1 : 1))
							.map(([user, groupedTasksUser]) => {
								return (
									<div key={user}>
										<div
											className='font-semibold text-lg flex bg-[#e0e0e0] px-8 py-1 items-center justify-between'
											onClick={() =>
												setUserListOpen((prevUser) =>
													prevUser === user
														? null
														: user,
												)
											}>
											<div>
												{groupedTasksUser.user.name}
											</div>
											<div>
												{userListOpen === user ? (
													<BsChevronUp />
												) : (
													<BsChevronDown />
												)}
											</div>
										</div>
										{userListOpen === user &&
											groupedTasksUser.GroupedTasksDate.sort(
												(a, b) =>
													a.date > b.date ? -1 : 1,
											).map(
												(
													{ date, taskArray },
													index,
												) => {
													return (
														<DateBox
															key={index}
															date={date}
															taskArray={
																taskArray
															}
															handleDeleteClick={
																handleDeleteClick
															}
															handleEditClick={
																handleEditClick
															}
														/>
													);
												},
											)}
									</div>
								);
							})}
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminTaskView;
