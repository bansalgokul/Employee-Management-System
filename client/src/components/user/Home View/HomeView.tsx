import { useEffect, useState } from "react";
import TaskView from "../../features/task/employee/TaskView";
import HomeViewTimer from "./HomeViewTimer";

const HomeView = () => {
	const [taskChanged, setTaskChanged] = useState(false);
	const [rerenderTaskView, setRerenderTaskView] = useState(false);

	useEffect(() => {
		setRerenderTaskView((prev) => !prev);
	}, [taskChanged]);

	return (
		<div className='w-full h-full bg-white rounded-lg flex flex-col'>
			<HomeViewTimer setTaskChanged={setTaskChanged} />
			<div className='h-[90%]'>
				<TaskView rerenderTaskView={rerenderTaskView} />
			</div>
		</div>
	);
};

export default HomeView;
