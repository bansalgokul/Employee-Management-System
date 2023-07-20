/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import api from "../../../../api/api";

import EditTask from "../EditTask";
import { Link, useLocation } from "react-router-dom";
import { Project, Task } from "../../../types";

import { BiDownArrow } from "react-icons/bi";

import { useDebounce } from "../../../debounce";
import TaskAllView from "./TaskAllView";
import TaskUserProjectView from "./TaskUserProjectView";
import DateFilter from "../../../Shared/DateFilter";

type Props = {
	taskList: Task[];
	setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
	projectList: Project[];
	setProjectList: React.Dispatch<React.SetStateAction<Project[]>>;
};

const AdminTaskView = ({
	taskList,
	setTaskList,
	projectList,
	setProjectList,
}: Props) => {
	const location = useLocation();
	const [isEditorOpen, setIsEditorOpen] = useState<Task | null>(null);

	const projectID = new URLSearchParams(location.search).get("ref");

	const [mode, setMode] = useState("All");
	const [modeDropdown, setModeDropdown] = useState(false);
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search, 500);

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

	return (
		<div className='flex justify-center h-full px-4 w-full flex-grow relative bg-white shadow-lg rounded-md pb-4 pt-2'>
			<div className='flex flex-col gap-2 w-full h-full '>
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
				<div className='flex justify-between items-center'>
					<div className='w-1/3'>
						<input
							type='text'
							className='px-3 py-2 m-1 bg-[#f5f5f5]	w-full rounded-xl'
							placeholder='Search'
							autoFocus
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>

					<div
						className='relative'
						onClick={() => setModeDropdown((prev) => !prev)}>
						<div className='flex items-center gap-2 justify-between w-[100px] px-3 py-2 m-1 bg-[#f5f5f5] rounded-xl'>
							{mode} <BiDownArrow />
						</div>
						{modeDropdown && (
							<div className='absolute z-10 right-0 top-10 w-[100px] bg-white border-2 text-gray-600 shadow-md rounded-md border-gray-100 p-2 mt-2'>
								<div
									className='flex items-center w-full px-2 py-1 gap-2 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800'
									onClick={() =>
										mode === "All" || setMode("All")
									}>
									All
								</div>
								<div
									className='flex items-center w-full px-2 py-1 gap-2 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800'
									onClick={() =>
										mode === "User" || setMode("User")
									}>
									User
								</div>
								<div
									className='flex items-center w-full px-2 py-1 gap-2 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800'
									onClick={() =>
										mode === "Project" || setMode("Project")
									}>
									Project
								</div>
							</div>
						)}
					</div>
				</div>
				<div>
					{mode === "All" && (
						<TaskAllView
							search={debouncedSearch}
							handleDeleteClick={handleDeleteClick}
							handleEditClick={handleEditClick}
						/>
					)}
					{/* Project Mode */}
					{(mode === "Project" || mode === "User") && (
						<TaskUserProjectView
							mode={mode === "Project" ? "project" : "user"}
							search={debouncedSearch}
							handleDeleteClick={handleDeleteClick}
							handleEditClick={handleEditClick}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default AdminTaskView;
