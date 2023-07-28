import { useEffect, useState } from "react";
import { Project, User } from "../../../../types";
import api from "../../../../../api/api";
import Loading from "../../../../Shared/Loading";
import TaskListing from "./TaskListing";

type Props = {
	search: string;
	status: string;
	mode: "user" | "project";
};

const TaskUserProjectView = ({ search, mode, status }: Props) => {
	const [users, setUsers] = useState<User[]>([]);
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);

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
	}, [search, mode, status]);
	// }, [search, currentPage, limit]);
	console.log(users);

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
