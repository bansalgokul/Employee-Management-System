import EditProject from "./EditProject";
import { useEffect, useState } from "react";
import api from "../../../../api/api";
import ViewProject from "./ViewProject";
import Loading from "../../../Shared/Loading";
import { Project, Task, User } from "../../../types";
import Button from "../../../Shared/Button";
import ProjectBox from "../../../Shared/Project/ProjectBox";
type Props = {
	projectList: Project[];
	setProjectList: React.Dispatch<React.SetStateAction<Project[]>>;
	userList: User[];
	setUserList: React.Dispatch<React.SetStateAction<User[]>>;
	taskList: Task[];
	setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
};

const AdminProjectView = ({
	projectList,
	setProjectList,
	userList,
	setUserList,
	taskList,
	setTaskList,
}: Props) => {
	const [isEditorOpen, setIsEditorOpen] = useState<
		Project | null | undefined
	>(null);
	const [isViewProjectOpen, setIsViewProjectOpen] = useState<Project | null>(
		null,
	);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(false);
	const projectID = new URLSearchParams(location.search).get("target");

	useEffect(() => {
		setLoading(true);

		async function getData() {
			try {
				const projectResponse = await api.get("/admin/project");
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
		if (projectID) {
			handleViewClick(projectID);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleEditClick = (id: string) => {
		const project = projectList.find((project) => project._id === id);
		if (project) {
			setIsEditorOpen(project);
		}
	};
	const handleViewClick = (id: string) => {
		const project = projectList.find((project) => project._id === id);
		if (project) {
			setIsEditorOpen(null);
			setIsViewProjectOpen(project);
		}
	};
	const handleDeleteClick = async (id: string) => {
		const url = `/admin/task/${id}`;
		const response = await api.delete(url);
		if (response.status === 200) {
			setProjectList(projectList.filter((project) => project._id !== id));
		}
	};
	const handleNewClick = () => {
		setIsEditorOpen(undefined);
	};

	return (
		<div className='flex justify-center h-full px-4 w-full relative bg-white shadow-lg rounded-md p-4'>
			{loading ? (
				<Loading />
			) : (
				<div className='flex flex-col gap-2 w-full h-full overflow-auto'>
					<div className='flex justify-between px-4 items-center py-1'>
						<input
							type='text'
							className='px-3 py-2 bg-[#f5f5f5]	w-1/2 rounded-xl'
							placeholder='Search Project'
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<Button name='+ Add' onClick={handleNewClick} />
					</div>
					{isViewProjectOpen && (
						<ViewProject
							project={isViewProjectOpen}
							setIsViewProjectOpen={setIsViewProjectOpen}
							taskList={taskList}
							setTaskList={setTaskList}
						/>
					)}
					{isEditorOpen !== null && (
						<EditProject
							project={isEditorOpen}
							setIsEditorOpen={setIsEditorOpen}
							projectList={projectList}
							setProjectList={setProjectList}
							userList={userList}
							setUserList={setUserList}
						/>
					)}
					<div>
						<div className='flex justify-between w-full'>
							<div className='w-[40%] text-center'>Title</div>
							<div className='w-[40%] text-center'>Assigned</div>
							<div className='w-[15%] text-center'>Completed</div>
							<div className='w-[5%] text-center'></div>
						</div>
					</div>
					<div className='flex flex-col border-b-4'>
						{projectList
							.filter((p) =>
								p.title
									.toLowerCase()
									.includes(search.toLowerCase()),
							)
							.map((project) => {
								return (
									<ProjectBox
										key={project._id}
										project={project}
										handleViewClick={handleViewClick}
										handleEditClick={handleEditClick}
										handleDeleteClick={handleDeleteClick}
										isAdminView={true}
									/>
								);
							})}
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminProjectView;
