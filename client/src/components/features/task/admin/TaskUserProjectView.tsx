import { useEffect, useState } from "react";
import { Project, User } from "../../../types";
import api from "../../../../api/api";
import Loading from "../../../Shared/Loading";
import TaskListing from "./TaskListing";

type Props = {
	search: string;
	handleDeleteClick: (id: string) => void;
	handleEditClick: (id: string) => void;
	mode: "user" | "project";
};

const TaskUserProjectView = ({
	search,
	handleDeleteClick,
	handleEditClick,
	mode,
}: Props) => {
	const [users, setUsers] = useState<User[]>([]);
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);

	// const [currentPage, setCurrentPage] = useState(1);
	// const [limit, setLimit] = useState(10);
	// const [totalCount, setTotalCount] = useState(0);

	// const onPageChange = (pageNumber: number) => {
	// 	setCurrentPage(pageNumber);
	// };

	// const handleLimitChange = (newLimit: number) => {
	// 	setLimit(newLimit);
	// };

	// useEffect(() => {
	// 	setCurrentPage(1);
	// }, [limit, search]);

	// //  await api.get(
	// // 	`/admin/task/?group=user&search=${search}`,
	// // );

	useEffect(() => {
		setLoading(true);
		const getGroupedTasks = async () => {
			try {
				const response = await api.get(
					`/admin/task/?group=${mode}&search=${search}`,
				);
				if (response.status === 200) {
					if (mode === "user") {
						setUsers(response.data.responseArray);
					} else {
						setProjects(response.data.responseArray);
					}
				}
			} catch (err) {
				console.log("Fetching All Tasks - ", err);
			} finally {
				setLoading(false);
			}
		};
		getGroupedTasks();
	}, [search, mode]);
	// }, [search, currentPage, limit]);

	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<div>
					<div className='flex flex-col h-[570px] overflow-auto scrollbar'>
						{/* Content */}

						{mode === "user" &&
							users.map((user) => {
								return (
									<TaskListing
										mode={mode}
										key={user._id}
										user={user}
										handleDeleteClick={handleDeleteClick}
										handleEditClick={handleEditClick}
									/>
								);
							})}
						{mode === "project" &&
							projects.map((project) => {
								return (
									<TaskListing
										mode={mode}
										key={project._id}
										project={project}
										handleDeleteClick={handleDeleteClick}
										handleEditClick={handleEditClick}
									/>
								);
							})}
					</div>
				</div>
			)}
		</>
	);
};

export default TaskUserProjectView;
