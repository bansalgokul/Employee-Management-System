import { useEffect, useState } from "react";
import AllTaskBox from "./AllTaskBox";
import { Task } from "../../../../types";
import api from "../../../../../api/api";
import Loading from "../../../../Shared/Loading";
import Pagination from "../../../../Shared/Paginate";
import DateFilter from "../../../../Shared/DateFilter";
import EditTask from "../../EditTask";

type Props = {
	search: string;
	status: string;
};

const TaskAllView = ({ search, status }: Props) => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [totalCount, setTotalCount] = useState(0);

	const [fromDate, setFromDate] = useState<string>("");
	const [toDate, setToDate] = useState<string>("");

	const [isChanged, setIsChanged] = useState(false);
	const [isEditorOpen, setIsEditorOpen] = useState<string | null>(null);

	const onPageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};

	const handleLimitChange = (newLimit: number) => {
		setLimit(newLimit);
	};

	useEffect(() => {
		setCurrentPage(1);
	}, [limit, search, fromDate, toDate]);

	const handleEditClick = (id: string) => {
		setIsEditorOpen(id);
	};
	const handleDeleteClick = async (id: string) => {
		const url = `admin/task/${id}`;
		await api.delete(url);
		setIsChanged((prev) => !prev);
	};

	useEffect(() => {
		setLoading(true);
		const getTasks = async () => {
			try {
				const response = await api.get(
					`/admin/task/?search=${search}&skip=${
						(currentPage - 1) * limit
					}&limit=${limit}&from=${fromDate}&to=${toDate}&status=${status}`,
				);
				if (response.status === 200) {
					setTasks(response.data.taskDocs);
					setTotalCount(response.data.totalRecords);
				}
			} catch (err) {
				console.log("Fetching All Tasks - ", err);
			} finally {
				setLoading(false);
			}
		};
		getTasks();
	}, [search, currentPage, limit, fromDate, toDate, isChanged, status]);

	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<>
					<>
						{isEditorOpen && (
							<EditTask
								setIsChanged={setIsChanged}
								task={isEditorOpen}
								setIsEditorOpen={setIsEditorOpen}
								isAdminView={true}
							/>
						)}
					</>
					<DateFilter
						fromDate={fromDate}
						toDate={toDate}
						setFromDate={setFromDate}
						setToDate={setToDate}
					/>
					<div className='flex items-center justify-between w-full py-2 border-b-4'>
						{/* Heading */}
						<div className='w-[15%] text-center'>User</div>
						<div className='w-[15%] text-center'>Project</div>
						<div className='w-[15%] text-center'>Description</div>
						<div className='w-[15%] text-center'>Date</div>
						<div className='w-[12%] text-center'>Started</div>
						<div className='w-[12%] text-center'>Ended</div>
						<div className='w-[10%] text-center'>Duration</div>
						<div className='w-[6%] text-center'></div>
					</div>
					<div className='flex flex-col h-[480px] overflow-auto '>
						{/* Content */}
						{tasks.map((task) => {
							return (
								<AllTaskBox
									key={task._id}
									handleDeleteClick={handleDeleteClick}
									handleEditClick={handleEditClick}
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
		</>
	);
};

export default TaskAllView;
