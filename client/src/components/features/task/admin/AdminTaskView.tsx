/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BiDownArrow } from "react-icons/bi";
import { useDebounce } from "../../../debounce";
import TaskAllView from "./All View/TaskAllView";
import TaskUserProjectView from "./User Project View/TaskUserProjectView";

const AdminTaskView = () => {
	const location = useLocation();

	const projectID = new URLSearchParams(location.search).get("ref");

	const [mode, setMode] = useState("All");
	const [modeDropdown, setModeDropdown] = useState(false);
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search, 500);

	return (
		<div className='flex justify-center h-full px-4 w-full flex-grow relative bg-white shadow-lg rounded-md pb-4 pt-2'>
			<div className='flex flex-col gap-2 w-full h-full '>
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
					{mode === "All" && <TaskAllView search={debouncedSearch} />}
					{/* Project Mode */}
					{(mode === "Project" || mode === "User") && (
						<TaskUserProjectView
							mode={mode === "Project" ? "project" : "user"}
							search={debouncedSearch}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default AdminTaskView;
