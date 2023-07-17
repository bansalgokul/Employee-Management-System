import { Project } from "../../../types";
import { useEffect, useState } from "react";
import api from "../../../../api/api";
import Loading from "../../../Shared/Loading";
import ProjectBox from "../../../Shared/Project/ProjectBox";

type Props = {
	projectList: Project[];
	setProjectList: React.Dispatch<React.SetStateAction<Project[]>>;
};

const ProjectView = ({ projectList, setProjectList }: Props) => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);

		async function getData() {
			try {
				const projectResponse = await api.get("/project");
				if (projectResponse.status === 200) {
					projectResponse.data.projectDocs.forEach(
						(project: Project) =>
							(project.assigned = project.assigned.filter(
								(p) => p.user?._id,
							)),
					);
					setProjectList(projectResponse.data.projectDocs);
				}

				setLoading(false);
			} catch (error) {
				console.log("Error fetching Projects:", error);
			}
		}

		getData();
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
