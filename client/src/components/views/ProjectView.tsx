import { FiCheckCircle, FiCircle } from "react-icons/fi";
import { Project } from "../user/UserRoute";

type Props = {
	projectList: Project[];
};

const ProjectView = ({ projectList }: Props) => {
	return (
		<div className='flex justify-center h-full px-4 w-full relative bg-white shadow-lg rounded-md p-4'>
			<div className='flex flex-col gap-2 w-full h-full overflow-auto'>
				<div>
					<div className='flex justify-between w-full'>
						<div className='w-[40%] text-center'>Title</div>
						<div className='w-[40%] text-center'>Assigned</div>
						<div className='w-[20%] text-center'>Completed</div>
					</div>
				</div>
				<div className='flex flex-col border-b-4'>
					{projectList.map((project) => {
						return (
							<div
								key={project._id}
								className='flex justify-between w-full py-2 border-y'>
								<div className='w-[40%] text-center'>
									{project.title}
								</div>
								<div className='w-[40%] text-center overflow-auto'>
									{project.assigned.map((p) => {
										return `${p.user.name} `;
									})}
								</div>
								<div className='w-[20%] flex justify-center items-center'>
									{project.completed ? (
										<FiCheckCircle />
									) : (
										<FiCircle />
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default ProjectView;
