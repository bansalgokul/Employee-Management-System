import { useState, useRef, useEffect } from "react";
import { GrClose } from "react-icons/gr";
import api from "../../api/api";
import { Task, Project } from "../types";
import Button from "../Shared/Button";
import { format } from "date-fns";
import { getDuration } from "../Shared/duration";

type Props = {
	taskList: Task[];
	setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
	projectList: Project[];
	setProjectList: React.Dispatch<React.SetStateAction<Project[]>>;
};

const HomeViewTimer = ({
	taskList,
	setTaskList,
	projectList,
	setProjectList,
}: Props) => {
	const [isTimerOn, setIsTimerOn] = useState(false);
	const [description, setDescription] = useState("");
	const [project, setProject] = useState(projectList?.[0]?._id);
	const [startedAt, setStartedAt] = useState(new Date());
	const [hours, setHours] = useState("00");
	const [minutes, setMinutes] = useState("00");
	const [seconds, setSeconds] = useState("00");

	useEffect(() => {
		if (localStorage["startTime"]) {
			const startTime = JSON.parse(
				localStorage.getItem("startTime") || "''",
			);
			setHours(startTime.slice(0, 2));
			setMinutes(startTime.slice(3, 5));
			setSeconds(startTime.slice(6, 8));

			setIsTimerOn(true);
		} else {
			setHours(new Date().getHours().toString().padStart(2, "0"));
			setMinutes(new Date().getMinutes().toString().padStart(2, "0"));
			setSeconds(new Date().getSeconds().toString().padStart(2, "0"));
		}
	}, []);

	useEffect(() => {
		const timeSet = new Date(
			new Date().setHours(
				parseInt(hours),
				parseInt(minutes),
				parseInt(seconds),
			),
		);

		setStartedAt(timeSet);
		if (isTimerOn) {
			localStorage.setItem(
				"startTime",
				JSON.stringify(`${hours}:${minutes}:${seconds}`),
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hours, minutes, seconds]);

	const handleStart = () => {
		setIsTimerOn(true);
		localStorage.setItem(
			"startTime",
			JSON.stringify(`${hours}:${minutes}:${seconds}`),
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

	const [blink, setBlink] = useState(false);
	const blinkIntervalRef = useRef<number>();

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
					max={format(new Date(), "HH:mm")}
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
					value={getDuration(startedAt).formatTime}
					disabled
				/>
			</div>
			<div className=' text-white  font-semibold flex'>
				{isTimerOn ? (
					<>
						<Button name='Stop' onClick={handleStop} />
						<Button
							icon={<GrClose />}
							onClick={handleCancel}
							styling='p-2 ml-2 text-xl'
						/>
					</>
				) : (
					<Button name='Start' onClick={handleStart} />
				)}
			</div>
		</div>
	);
};

export default HomeViewTimer;
