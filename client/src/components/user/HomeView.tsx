import TaskView from "../features/task/employee/TaskView";
import { Task, Project } from "../types";
import HomeViewTimer from "./HomeViewTimer";

type Props = {
	taskList: Task[];
	setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
	projectList: Project[];
	setProjectList: React.Dispatch<React.SetStateAction<Project[]>>;
};

const HomeView = ({
	taskList,
	setTaskList,
	projectList,
	setProjectList,
}: Props) => {
	return (
		<div className='w-full h-full bg-white rounded-lg flex flex-col'>
			<HomeViewTimer
				setTaskList={setTaskList}
				taskList={taskList}
				projectList={projectList}
				setProjectList={setProjectList}
			/>

			<div className='h-[90%]'>
				<TaskView
					setTaskList={setTaskList}
					taskList={taskList}
					projectList={projectList}
					setProjectList={setProjectList}
				/>
			</div>
		</div>
	);
};

export default HomeView;
