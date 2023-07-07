import { useEffect, useState } from "react";
import TaskView from "./TaskView";
import { Project } from "./ProjectView";
import { format } from "date-fns";
import TimePicker from "react-time-picker";
import Picker from "rc-picker";
import "rc-picker/assets/index.css";

type Props = {
	projectList: Project[];
};
// Initialization for ES Users
import { Input, Timepicker, initTE } from "tw-elements";

initTE({ Input, Timepicker });

const HomeView = ({ projectList }: Props) => {
	const [isTimerOn, setIsTimerOn] = useState(false);
	const [description, setDescription] = useState("");
	const [project, setProject] = useState(projectList[0]._id);
	const [startTime, setStartTime] = useState(new Date());
	const [hours, setHours] = useState(new Date().getHours());
	const [minutes, setMinutes] = useState(new Date().getMinutes());
	const [value, onChange] = useState("00:00");

	console.log(hours, minutes);

	useEffect(() => {
		setStartTime(new Date(startTime.setHours(hours, minutes)));
	}, [hours, minutes, isTimerOn]);

	const startTimer = () => {
		setIsTimerOn(true);
		// localStorage.setItem("startTime", JSON.stringify(startTime));

		// Make api post
	};
	const stopTimer = () => {
		// localStorage.removeItem("startTime");
		setIsTimerOn(false);

		// Make api put request
	};

	return (
		<div className='col-start-1 col-end-11 row-start-2 row-end-11 p-8 shadow-lg'>
			<div className='w-full h-full bg-white p-4 px-10'>
				<div className=' flex items-center w-full bg-[#f8f8f8] p-2 justify-between rounded-md'>
					<div className='w-1/3'>
						<input
							type='text'
							placeholder='Description'
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className='w-full p-2 rounded-md'
						/>
					</div>
					<div className='w-1/3'>
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
						<Picker />
					</div>
					<div>
						<input type='time' name='' id='' disabled />
					</div>
					<div className='bg-[#3B71CA] text-white p-2 px-4 rounded-md font-semibold'>
						{isTimerOn ? (
							<button onClick={stopTimer}>Stop</button>
						) : (
							<button onClick={startTimer}>Start</button>
						)}
					</div>
				</div>
				<div className='mt-8'>
					<TaskView isAdminView={false} />
				</div>
			</div>
		</div>
	);
};

export default HomeView;
