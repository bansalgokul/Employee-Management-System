import { User } from "../App";
import ProfileView from "./views/ProfileView";
import ProjectView from "./views/ProjectView";
import TaskView from "./views/TaskView";

type Props = {
	userInfo: User;
};
const MainView = ({ userInfo }: Props) => {
	return (
		<div className='col-start-2 col-end-11 row-start-2 row-end-11 p-6'>
			{/* <ProfileView userInfo={userInfo} /> */}
			{/* <TaskView /> */}
			<ProjectView />
		</div>
	);
};

export default MainView;
