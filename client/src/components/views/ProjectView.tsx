import { useEffect, useState } from "react";
import api from "../../api/api";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiCheckCircle, FiCircle } from "react-icons/fi";

export type Project = {
	_id: string;
	title: string;
	description: string;
	completed: boolean;
	assigned: Array<object>;
};

type Props = {
	isAdminView: boolean;
};

const ProjectView = ({ isAdminView }: Props) => {
	const [projectList, setProjectList] = useState<Project[]>([]);

	useEffect(() => {
		async function getProjects() {
			try {
				const url = isAdminView ? "/admin/project" : "/project";
				const response = await api.get(url);
				if (response.status === 200) {
					setProjectList(response.data.projectDocs);
					console.log(response.data);
				}
			} catch (error) {
				console.log("Error fetching Projects:", error);
			}
		}

		getProjects();
	}, []);

	return (
		<div className='flex justify-center h-full px-4 w-full relative bg-white shadow-lg rounded-md p-4'>
			<div className='flex flex-col gap-2 w-full h-full overflow-auto'>
				<div>
					<div className='flex justify-between w-full'>
						<div className='w-[450px]'>Title</div>
						<div className='w-[180px] text-center'>Assigned</div>
						<div className='w-[180px] text-center'>Completed</div>
						<div className='w-[50px]'></div>
					</div>
				</div>
				<div className='flex flex-col border-b-4'>
					{projectList.map((project) => {
						return (
							<div
								key={project._id}
								className='flex justify-between w-full py-2 border-y'>
								<div className='w-[450px]'>{project.title}</div>
								<div className='w-[180px] text-center'>
									{project.assigned.length}
								</div>
								<div className='w-[180px] flex justify-center items-center'>
									{project.completed ? (
										<FiCheckCircle />
									) : (
										<FiCircle />
									)}
								</div>
								<div className='w-[50px]'>
									<BsThreeDotsVertical />
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
