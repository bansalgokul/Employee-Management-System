import { Project } from "../../../types";
import { useEffect, useState } from "react";
import Loading from "../../../Shared/Loading";
import ProjectBox from "../common/ProjectBox";
import { getUserProjects } from "../../../../api/apiFunctions";

const ProjectView = () => {
	const [projectList, setProjectList] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchProjects = async () => {
		try {
			await getUserProjects(setProjectList);
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setLoading(true);
		fetchProjects();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='flex justify-center h-full px-4 w-full relative bg-white shadow-lg rounded-md p-4'>
			{loading ? (
				<Loading />
			) : (
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
								<ProjectBox
									key={project._id}
									project={project}
									isAdminView={false}
								/>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};

export default ProjectView;
