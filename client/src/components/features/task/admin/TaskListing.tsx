/* eslint-disable no-mixed-spaces-and-tabs */
import { BsChevronUp, BsChevronDown } from "react-icons/bs";
import Pagination from "../../../Shared/Paginate";
import UserTaskBox from "./UserTaskBox";
import { Project, Task, User } from "../../../types";
import { useEffect, useState } from "react";
import api from "../../../../api/api";
import ProjectTaskBox from "./ProjectTaskBox";
import DateFilter from "../../../Shared/DateFilter";

type Props = {
	user?: User;
	project?: Project;
	handleDeleteClick: (id: string) => void;
	handleEditClick: (id: string) => void;
	mode: "project" | "user";
};

const TaskListing = ({
	user,
	project,
	handleDeleteClick,
	handleEditClick,
	mode,
}: Props) => {
	const [listOpen, setListOpen] = useState(false);
	const [taskList, setTaskList] = useState<Task[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [totalCount, setTotalCount] = useState(0);
	const [loading, setLoading] = useState(true);

	const [fromDate, setFromDate] = useState<string>("");
	const [toDate, setToDate] = useState<string>("");

	const onPageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};

	const handleLimitChange = (newLimit: number) => {
		setLimit(newLimit);
	};

	useEffect(() => {
		setCurrentPage(1);
	}, [limit, fromDate, toDate, mode]);

	useEffect(() => {
		setLoading(true);
		const getGroupedTasks = async () => {
			try {
				const response = await api.get(
					`/admin/task/?group=${mode}&search=&skip=${
						(currentPage - 1) * limit
					}&limit=${limit}&target=${
						user?._id || project?._id
					}&from=${fromDate}&to=${toDate}`,
				);
				if (response.status === 200) {
					setTaskList(response.data.taskDocs);
					setTotalCount(response.data.totalRecords);
				}
			} catch (err) {
				console.log("Fetching All Tasks - ", err);
			} finally {
				setLoading(false);
			}
		};
		if (listOpen) {
			getGroupedTasks();
		}
	}, [
		currentPage,
		limit,
		mode,
		project?._id,
		user?._id,
		listOpen,
		fromDate,
		toDate,
	]);

	return (
		<div>
			<div
				className='font-semibold bg-[#f2f2f2] text-lg flex px-8 py-2 border-b-2 items-center justify-between'
				onClick={() => setListOpen((prev) => !prev)}>
				<div>{user?.name || project?.title}</div>
				<div>{listOpen ? <BsChevronUp /> : <BsChevronDown />}</div>
			</div>
			<div>
				{listOpen && !loading && (
					<>
						<DateFilter
							fromDate={fromDate}
							toDate={toDate}
							setFromDate={setFromDate}
							setToDate={setToDate}
						/>
						<div className='flex items-center justify-between w-full py-1 border-b-2'>
							{/* Heading */}
							{mode === "project" && (
								<div className='w-[15%] text-center'>User</div>
							)}
							{mode === "user" && (
								<div className='w-[15%] text-center'>
									Project
								</div>
							)}
							<div className='w-[20%] text-center'>
								Description
							</div>
							<div className='w-[20%] text-center'>Date</div>
							<div className='w-[15%] text-center'>Started</div>
							<div className='w-[15%] text-center'>Ended</div>
							<div className='w-[10%] text-center'>Duration</div>
							<div className='w-[5%] text-center'></div>
						</div>

						<div className='max-h-[420px] overflow-auto'>
							{mode === "user"
								? taskList.map((task) => {
										return (
											<UserTaskBox
												key={task._id}
												handleDeleteClick={
													handleDeleteClick
												}
												handleEditClick={
													handleEditClick
												}
												task={task}
											/>
										);
								  })
								: taskList.map((task) => {
										return (
											<ProjectTaskBox
												key={task._id}
												handleDeleteClick={
													handleDeleteClick
												}
												handleEditClick={
													handleEditClick
												}
												task={task}
											/>
										);
								  })}
						</div>
						<Pagination
							currentPage={currentPage}
							pageSize={limit}
							totalCount={totalCount}
							onPageChange={onPageChange}
							handleLimitChange={handleLimitChange}
							limitRange={[5, 10, 15]}
						/>
					</>
				)}
			</div>
		</div>
	);
};

export default TaskListing;
