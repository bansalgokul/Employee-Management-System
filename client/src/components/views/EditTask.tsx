import { useEffect, useRef, useState } from "react";
import { Project, Task } from "../user/UserRoute";
import api from "../../api/api";
import { format } from "date-fns";

type Props = {
	task: Task;
	setIsEditorOpen: React.Dispatch<React.SetStateAction<Task | null>>;
	taskList: Task[];
	setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
	projectList: Project[];
	isAdminView: boolean;
};

const EditTask = ({
	task,
	setIsEditorOpen,
	taskList,
	setTaskList,
	projectList,
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
	useEffect(() => {
		ref.current?.scrollIntoView({
			behavior: "smooth",
			block: "end",
			inline: "nearest",
		});
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
		<div ref={ref}>
			<div className=' flex flex-col  w-full bg-[#f8f8f8] p-4 gap-4 justify-between rounded-md relative'>
				<div className='flex gap-6 items-center'>
					<label htmlFor='description' className='w-1/5 text-center'>
						Description:{" "}
					</label>
					<input
						type='text'
						name='description'
						id='description'
						placeholder='Description'
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className='w-1/2 p-2 rounded-md'
					/>
				</div>
				<div className='flex gap-6 items-center'>
					<label htmlFor='project' className='w-1/5 text-center'>
						Project:{" "}
					</label>
					<select
						name='project'
						id='project'
						value={project}
						onChange={(e) => setProject(e.target.value)}
						className='w-1/2 p-2 rounded-md'>
						{projectList
							.filter((p) =>
								p.assigned.find(
									(user) => user.user._id === task.user._id,
								),
							)
							.map((p) => {
								return (
									<option key={p._id} value={p._id}>
										{p.title}
									</option>
								);
							})}
					</select>
				</div>
				{isAdminView && (
					<>
						<div className='flex gap-6 items-center'>
							<label htmlFor='user' className='w-1/5 text-center'>
								User:{" "}
							</label>
							<input
								name='user'
								id='user'
								className='w-1/2 p-2 rounded-md bg-white'
								value={task.user.name}
								disabled></input>
						</div>
						<div className='flex gap-6 items-center'>
							<label htmlFor='date' className='w-1/5 text-center'>
								Date:{" "}
							</label>
							<input
								type='date'
								name='date'
								id='date'
								className='p-2 rounded-md'
								value={date}
								onChange={(e) => {
									if (e.target.value > e.target.max) {
										return alert("cannot set future date");
									}
									setDate(e.target.value);
								}}
								max={format(new Date(), "yyyy-MM-dd")}
							/>
						</div>
					</>
				)}
				<div className='flex gap-6 items-center'>
					<label htmlFor='startTime' className='w-1/5 text-center'>
						Start Time:{" "}
					</label>
					<input
						type='time'
						name='startTime'
						id='startTime'
						className='p-2 rounded-md'
						value={`${shours}:${sminutes}`}
						onChange={(e) => {
							if (
								(!isAdminView &&
									e.target.value > e.target.max) ||
								e.target.value > `${ehours}:${eminutes}`
							) {
								return alert("cannot set future time");
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
				<div className='flex gap-6 items-center'>
					<label htmlFor='endTime' className='w-1/5 text-center'>
						End Time:{" "}
					</label>
					<input
						type='time'
						name='endTime'
						id='endTime'
						className='p-2 rounded-md'
						value={`${ehours}:${eminutes}`}
						onChange={(e) => {
							if (
								(!isAdminView &&
									e.target.value > e.target.max) ||
								e.target.value < `${shours}:${sminutes}`
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
				<div className='absolute bottom-4 right-4 flex gap-4'>
					<div>
						<button
							className='bg-[#3B71CA] rounded-md p-2 px-4 text-white'
							onClick={handleCancel}>
							Cancel
						</button>
					</div>
					<div>
						<button
							className='bg-[#3B71CA] rounded-md p-2 px-4 text-white'
							onClick={handleSave}>
							Save
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditTask;
