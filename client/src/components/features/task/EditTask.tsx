import { useEffect, useRef, useState } from "react";
import api from "../../../api/api";
import { format } from "date-fns";
import { Task, Project } from "../../types";
import Loading from "../../Shared/Loading";
import Button from "../../Shared/Button";
import { GrClose } from "react-icons/gr";

type Props = {
	task: Task;
	setIsEditorOpen: React.Dispatch<React.SetStateAction<Task | null>>;
	taskList: Task[];
	setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
	projectList: Project[];
	setProjectList: React.Dispatch<React.SetStateAction<Project[]>>;
	isAdminView: boolean;
};

const EditTask = ({
	task,
	setIsEditorOpen,
	taskList,
	setTaskList,
	projectList,
	setProjectList,
	isAdminView,
}: Props) => {
	const [description, setDescription] = useState(task.description);
	const [project, setProject] = useState(task.project._id);
	const [date, setDate] = useState(
		format(new Date(task.startedAt), "yyyy-MM-dd"),
	);
	const [startedAt, setStartedAt] = useState(new Date(task.startedAt));
	const [shours, setSHours] = useState(
		startedAt.getHours().toString().padStart(2, "0"),
	);
	const [sminutes, setSMinutes] = useState(
		startedAt.getMinutes().toString().padStart(2, "0"),
	);
	const [endedAt, setEndedAt] = useState(new Date(task.endedAt));
	const [ehours, setEHours] = useState(
		endedAt.getHours().toString().padStart(2, "0"),
	);
	const [eminutes, setEMinutes] = useState(
		endedAt.getMinutes().toString().padStart(2, "0"),
	);

	const ref = useRef<HTMLDivElement>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);

		async function getData() {
			try {
				const projectUrl = isAdminView ? "/admin/project" : "/project";
				// const taskUrl = isAdminView ? "/admin/task" : "/task";
				const projectResponse = await api.get(projectUrl);

				if (projectResponse.status === 200) {
					projectResponse.data.projectDocs.forEach(
						(project: Project) =>
							(project.assigned = project.assigned.filter(
								(p) => p.user?._id,
							)),
					);
					setProjectList(projectResponse.data.projectDocs);
				}

				setLoading(false);
			} catch (error) {
				console.log("Error fetching Projects:", error);
			}
		}

		getData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const timeSet = new Date(
			new Date(date).setHours(parseInt(shours), parseInt(sminutes)),
		);

		setStartedAt(timeSet);
	}, [shours, sminutes, date]);

	useEffect(() => {
		const timeSet = new Date(
			new Date(date).setHours(parseInt(ehours), parseInt(eminutes)),
		);

		setEndedAt(timeSet);
	}, [ehours, eminutes, date]);

	const handleSave = async () => {
		if (description.length === 0) {
			return alert("description cannot be empty");
		}

		const editedTask = {
			_id: task._id,
			description,
			project,
			startedAt,
			endedAt,
		};

		const url = isAdminView ? "/admin/task" : "/task";
		const response = await api.put(url, editedTask);
		if (response.status === 200) {
			setTaskList(
				taskList.map((t) => {
					if (t._id !== task._id) {
						return t;
					}
					return response.data.taskDoc;
				}),
			);
			setDescription("");
		}

		setIsEditorOpen(null);
	};

	const handleCancel = () => {
		setIsEditorOpen(null);
	};

	return (
		<div
			onClick={handleCancel}
			className='z-30 top-0 left-0 bg-[#f5f5f5] bg-opacity-50 fixed w-full h-full grid place-content-center'>
			{loading ? (
				<Loading />
			) : (
				<div
					onClick={(e) => {
						e.stopPropagation();
					}}
					className='border-2 p-4 rounded-md bg-white w-[470px] h-[450px] flex flex-col justify-between'>
					<div className=' flex text-xl font-semibold justify-between  items-center'>
						<div className='px-3 pb-2'>
							{task ? "EDIT TASK" : "ADD TASK"}
						</div>
						<div
							onClick={handleCancel}
							className='hover:cursor-pointer px-3 pb-2'>
							<GrClose />
						</div>
					</div>
					<div className='grow py-2 border-y-2'>
						<form
							id='editTaskForm'
							className='w-full flex flex-col gap-2 relative'
							onSubmit={(e) => handleSave()}>
							<div className='flex items-center'>
								<label
									htmlFor='description'
									className='w-[120px] text-center'>
									Description
								</label>
								<input
									type='text'
									name='description'
									id='description'
									placeholder='Description'
									value={description}
									onChange={(e) =>
										setDescription(e.target.value)
									}
									className='px-3 py-2 bg-[#f5f5f5]	w-[300px] rounded-xl'
								/>
							</div>
							<div className='flex items-center'>
								<label
									htmlFor='project'
									className='w-[120px] text-center'>
									Project:{" "}
								</label>
								<select
									name='project'
									id='project'
									value={project}
									onChange={(e) => setProject(e.target.value)}
									className='px-3 py-2 bg-[#f5f5f5]	w-[300px] rounded-xl'>
									{projectList
										.filter((p) =>
											p.assigned.find(
												(user) =>
													user.user._id ===
													task.user._id,
											),
										)
										.map((p) => {
											return (
												<option
													key={p._id}
													value={p._id}>
													{p.title}
												</option>
											);
										})}
								</select>
							</div>

							{isAdminView && (
								<>
									<div className='flex items-center'>
										<label
											htmlFor='user'
											className='w-[120px] text-center'>
											User:{" "}
										</label>
										<input
											name='user'
											id='user'
											className='px-3 py-2 bg-[#f5f5f5]	w-[300px] rounded-xl'
											value={task.user.name}
											disabled></input>
									</div>
									<div className='flex items-center'>
										<label
											htmlFor='date'
											className='w-[120px] text-center'>
											Date:{" "}
										</label>
										<input
											type='date'
											name='date'
											id='date'
											className='px-3 py-2 bg-[#f5f5f5]	w-[300px] rounded-xl'
											value={date}
											onChange={(e) => {
												if (
													e.target.value >
													e.target.max
												) {
													return alert(
														"cannot set future date",
													);
												}
												setDate(e.target.value);
											}}
											max={format(
												new Date(),
												"yyyy-MM-dd",
											)}
										/>
									</div>
								</>
							)}
							<div className='flex items-center'>
								<label
									htmlFor='startTime'
									className='w-[120px] text-center'>
									Start Time:{" "}
								</label>
								<input
									type='time'
									name='startTime'
									id='startTime'
									className='px-3 py-2 bg-[#f5f5f5]	w-[300px] rounded-xl'
									value={`${shours}:${sminutes}`}
									onChange={(e) => {
										if (
											(!isAdminView &&
												e.target.value >
													e.target.max) ||
											e.target.value >
												`${ehours}:${eminutes}`
										) {
											return alert(
												"cannot set future time",
											);
										}
										setSHours(e.target.value.slice(0, 2));
										setSMinutes(e.target.value.slice(3, 5));
									}}
									max={
										!isAdminView
											? `${new Date().getHours()}:${new Date().getMinutes()}`
											: undefined
									}
								/>
							</div>
							<div className='flex items-center'>
								<label
									htmlFor='endTime'
									className='w-[120px] text-center'>
									End Time:{" "}
								</label>
								<input
									type='time'
									name='endTime'
									id='endTime'
									className='px-3 py-2 bg-[#f5f5f5]	w-[300px] rounded-xl'
									value={`${ehours}:${eminutes}`}
									onChange={(e) => {
										if (
											(!isAdminView &&
												e.target.value >
													e.target.max) ||
											e.target.value <
												`${shours}:${sminutes}`
										) {
											return alert("Invalid Time");
										}
										setEHours(e.target.value.slice(0, 2));
										setEMinutes(e.target.value.slice(3, 5));
									}}
									max={
										!isAdminView
											? `${new Date().getHours()}:${new Date().getMinutes()}`
											: undefined
									}
								/>
							</div>
						</form>
					</div>

					<div className='flex justify-end gap-2 border-t-2 pt-4'>
						<div>
							<Button name='Cancel' onClick={handleCancel} />
						</div>
						<div>
							<Button
								name='Save'
								type='submit'
								form='editTaskForm'
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default EditTask;
