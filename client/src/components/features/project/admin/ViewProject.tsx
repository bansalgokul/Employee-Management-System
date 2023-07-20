import { useEffect, useState } from "react";
import { BiCheckbox, BiCheckboxChecked } from "react-icons/bi";
import { GrClose } from "react-icons/gr";
import api from "../../../../api/api";
import Loading from "../../../Shared/Loading";
import { useNavigate } from "react-router-dom";
import { Project, Task } from "../../../types";

type Props = {
	project: Project;
	setIsViewProjectOpen: React.Dispatch<React.SetStateAction<Project | null>>;
	taskList: Task[];
	setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
};

const ViewProject = ({
	setIsViewProjectOpen,
	project,
	taskList,
	setTaskList,
}: Props) => {
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		setLoading(true);

		async function getData() {
			try {
				const projectResponse = await api.get(
					`/admin/project/?id=${project._id}`,
				);
				if (projectResponse.status === 200) {
					// eslint-disable-next-line react-hooks/exhaustive-deps
					project = projectResponse.data.projectDoc;
				}

				const taskResponse = await api.get("/admin/task");
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
				console.log("Error fetching data:", error);
			}
		}

		getData();
	}, []);

	const handleCancel = () => {
		setIsViewProjectOpen(null);
		navigate(`/admin/project`);
	};

	const getTotalWork = () => {
		let time = 0;
		taskList
			.filter((task) => task.project._id === project._id)
			.forEach((task) => {
				time +=
					new Date(task.endedAt).getTime() -
					new Date(task.startedAt).getTime();
			});
		const mins = Math.floor((time / (1000 * 60)) % 60);
		const hours = Math.floor(time / (1000 * 60 * 60));

		return { mins, hours };
	};

	const getTotalWorkUser = (userID: string) => {
		let time = 0;
		taskList
			.filter(
				(task) =>
					task.project._id === project._id &&
					task.user._id === userID,
			)
			.forEach((task) => {
				time +=
					new Date(task.endedAt).getTime() -
					new Date(task.startedAt).getTime();
			});
		const mins = Math.floor((time / (1000 * 60)) % 60);
		const hours = Math.floor(time / (1000 * 60 * 60));

		return { mins, hours };
	};

	return (
		<div
			onClick={handleCancel}
			className='z-30 top-0 left-0 bg-[#f5f5f5] bg-opacity-50 fixed w-full h-full grid place-content-center'>
			{loading ? (
				<Loading />
			) : (
				<div
					onClick={(e) => e.stopPropagation()}
					className='border-2 p-4 rounded-md bg-white w-[600px] h-[600px] flex flex-col justify-between'>
					<div className=' flex text-xl font-semibold justify-between  items-center'>
						<div className='px-3 pb-2'>{project.title}</div>
						<div
							onClick={handleCancel}
							className='hover:cursor-pointer px-3 pb-2'>
							<GrClose />
						</div>
					</div>
					<div className='grow py-2 border-y-2 pt-4'>
						<div className='w-full flex flex-col gap-2 relative'>
							<div className='flex items-center '>
								<label
									htmlFor='description'
									className='w-[120px] text-center'>
									Description:{" "}
								</label>
								<div className='px-3 py-2 bg-white w-[300px] rounded-xl'>
									{" "}
									{project.description}
								</div>
							</div>
							<div className='flex items-center'>
								<div className='w-[120px] text-center'>
									Assigned: {project.assigned.length}
								</div>
								<div>
									Total Work:{" "}
									{`${getTotalWork().hours.toString()} hr ${getTotalWork().mins.toString()} mins`}
								</div>
							</div>

							<div className='flex items-center'>
								<div className='bg-white	w-full rounded-xl relative'>
									<div className='flex flex-col justify-between items-center'>
										<div className='bg-white rounded-xl w-full px-3 py-1 '>
											<div className='pt-2'>
												<input
													type='text'
													value={search}
													onChange={(e) =>
														setSearch(
															e.target.value,
														)
													}
													placeholder='Search User'
													className='px-3 py-1 bg-[#fafafa] mb-1 text-black border-2 rounded-lg'
												/>
											</div>
											<div className='overflow-auto  h-[300px]'>
												{project.assigned
													.filter((user) =>
														user.user.name
															.toLowerCase()
															.includes(
																search.toLowerCase(),
															),
													)
													.map((user) => {
														return (
															<div
																onClick={() =>
																	navigate(
																		`/admin/?ref=${project._id}&target=${user.user._id}`,
																	)
																}
																key={
																	user.user
																		._id
																}
																className='flex  hover:cursor-pointer justify-between border-b  p-2 items-center'>
																<div>
																	{
																		user
																			.user
																			.name
																	}
																</div>
																<div>
																	{`${getTotalWorkUser(
																		user
																			.user
																			._id,
																	).hours.toString()} hrs ${getTotalWorkUser(
																		user
																			.user
																			._id,
																	).mins.toString()} mins`}
																</div>
															</div>
														);
													})}
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className='flex items-center'>
								<label
									htmlFor='completed'
									className='w-[120px] text-center'>
									Completed:
								</label>

								<div className='px-3 py-2 text-4xl font-light text-[#3B71CA]	w-[300px] rounded-xl'>
									{project.completed ? (
										<BiCheckboxChecked />
									) : (
										<BiCheckbox />
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ViewProject;
