import { useEffect, useRef, useState } from "react";
import TaskView from "./TaskView";
import { Project, Task } from "../user/UserRoute";
import { GrClose } from "react-icons/gr";
import api from "../../api/api";

type Props = {
	taskList: Task[];
	setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
	projectList: Project[];
};

const HomeView = ({ taskList, setTaskList, projectList }: Props) => {
	const [isTimerOn, setIsTimerOn] = useState(false);
	const [description, setDescription] = useState("");
	const [project, setProject] = useState(projectList[0]._id);
	const [startedAt, setStartedAt] = useState(new Date());
	const [hours, setHours] = useState("00");
	const [minutes, setMinutes] = useState("00");
	const [blink, setBlink] = useState(false);
	const blinkIntervalRef = useRef<number>();

	const durationInMilliseconds =
		new Date().getTime() - new Date(startedAt).getTime();

	const Dsec = Math.floor(durationInMilliseconds / 1000) % 60;
	const Dmin = Math.floor(durationInMilliseconds / (1000 * 60)) % 60;
	const Dhr = Math.floor(durationInMilliseconds / (1000 * 60 * 60)) % 24;

	useEffect(() => {
		if (localStorage["startTime"]) {
			const startTime = JSON.parse(
				localStorage.getItem("startTime") || "''",
			);
			setHours(startTime.slice(0, 2));
			setMinutes(startTime.slice(3, 5));
			setIsTimerOn(true);
		} else {
			setHours(new Date().getHours().toString().padStart(2, "0"));
			setMinutes(new Date().getMinutes().toString().padStart(2, "0"));
		}
	}, []);

	useEffect(() => {
		const timeSet = new Date(
			new Date().setHours(parseInt(hours), parseInt(minutes)),
		);

		setStartedAt(timeSet);
		if (isTimerOn) {
			localStorage.setItem(
				"startTime",
				JSON.stringify(`${hours}:${minutes}`),
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hours, minutes]);

	const handleStart = () => {
		setIsTimerOn(true);
		localStorage.setItem(
			"startTime",
			JSON.stringify(`${hours}:${minutes}`),
		);
	};

	const handleStop = async () => {
		if (description.length === 0) {
			return alert("description cannot be empty");
		}
		localStorage.removeItem("startTime");
		setIsTimerOn(false);

		const newTask = {
			description,
			project,
			startedAt,
			endedAt: new Date(),
		};

		const response = await api.post("/task", newTask);
		if (response.status === 201) {
			setTaskList([...taskList, response.data.taskDoc]);
		}
		setDescription("");
	};

	const handleCancel = () => {
		localStorage.removeItem("startTime");
		setIsTimerOn(false);
		setDescription("");
	};

	useEffect(() => {
		if (isTimerOn) {
			blinkIntervalRef.current = window.setInterval(() => {
				setBlink((prevBlink) => !prevBlink);
			}, 500);
		} else {
			clearInterval(blinkIntervalRef.current);
			setBlink(false);
		}

		return () => {
			clearInterval(blinkIntervalRef.current);
		};
	}, [isTimerOn]);

	return (
		<div className='w-full h-full bg-white p-4 px-10 flex flex-col gap-4'>
			<div className=' flex items-center w-full bg-[#f8f8f8] p-2  justify-between rounded-md'>
				<div className='w-1/4'>
					<input
						type='text'
						placeholder='Description'
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className='w-full p-2 rounded-md'
					/>
				</div>
				<div className='w-1/4'>
					<select
						name=''
						id=''
						value={project}
						onChange={(e) => setProject(e.target.value)}
						className='w-full p-2 rounded-md'>
						{projectList.map((p) => {
							return (
								<option key={p._id} value={p._id}>
									{p.title}
								</option>
							);
						})}
					</select>
				</div>
				<div className=''>
					<input
						type='time'
						name=''
						id=''
						className='p-2 rounded-md'
						value={`${hours}:${minutes}`}
						onChange={(e) => {
							if (e.target.value > e.target.max) {
								return alert("cannot set future time");
							}
							setHours(e.target.value.slice(0, 2));
							setMinutes(e.target.value.slice(3, 5));
						}}
						max={`${new Date().getHours()}:${new Date().getMinutes()}`}
					/>
				</div>
				<div>
					<input
						type='time'
						name=''
						id=''
						className={`p-2 rounded-md bg-white ${
							blink ? "text-red-500" : ""
						}`}
						value={`${Dhr.toString().padStart(
							2,
							"0",
						)}:${Dmin.toString().padStart(
							2,
							"0",
						)}:${Dsec.toString().padStart(2, "0")}`}
						disabled
					/>
				</div>
				<div className=' text-white  font-semibold flex'>
					{isTimerOn ? (
						<>
							<button
								className='bg-[#3B71CA] rounded-md p-2 px-4'
								onClick={handleStop}>
								Stop
							</button>
							<button className='p-2 px-4' onClick={handleCancel}>
								<GrClose />
							</button>
						</>
					) : (
						<button
							className='bg-[#3B71CA] rounded-md p-2 px-4'
							onClick={handleStart}>
							Start
						</button>
					)}
				</div>
			</div>

			<div className='h-[85%]'>
				<TaskView
					setTaskList={setTaskList}
					taskList={taskList}
					projectList={projectList}
				/>
			</div>
		</div>
	);
};

export default HomeView;
