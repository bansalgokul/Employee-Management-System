import { FiCheckCircle, FiCircle } from "react-icons/fi";
import { Project } from "../user/UserRoute";
import EditProject from "./EditProject";
import { useState } from "react";
import api from "../../api/api";
import { BsThreeDotsVertical } from "react-icons/bs";
import { User } from "../../App";
import AddProject from "./AddProject";
type Props = {
	projectList: Project[];
	setProjectList: React.Dispatch<React.SetStateAction<Project[]>>;
	userList: User[];
};

const AdminProjectView = ({ projectList, setProjectList, userList }: Props) => {
	const [isEditorOpen, setIsEditorOpen] = useState<Project | null>(null);
	const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
	const [isDropDownOpen, setIsDropDownOpen] = useState<string | null>(null);

	const handleEditClick = (id: string) => {
		const project = projectList.find((project) => project._id === id);
		if (project) {
			setIsEditorOpen(project);
			setIsNewProjectOpen(false);
		}
	};
	const handleViewClick = (id: string) => {
		const project = projectList.find((project) => project._id === id);
		if (project) {
			setIsEditorOpen(project);
			setIsNewProjectOpen(false);
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
		setIsNewProjectOpen(true);
		setIsEditorOpen(null);
	};

	return (
		<div className='flex justify-center h-full px-4 w-full relative bg-white shadow-lg rounded-md p-4'>
			<div className='flex flex-col gap-2 w-full h-full overflow-auto'>
				{isEditorOpen && (
					<EditProject
						project={isEditorOpen}
						setIsEditorOpen={setIsEditorOpen}
						projectList={projectList}
						setProjectList={setProjectList}
						userList={userList}
					/>
				)}
				{isNewProjectOpen && (
					<AddProject
						projectList={projectList}
						setProjectList={setProjectList}
						userList={userList}
						setIsNewProjectOpen={setIsNewProjectOpen}
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
					{projectList.map((project) => {
						return (
							<div
								key={project._id}
								className='flex justify-between w-full py-2 border-y'>
								<div className='w-[40%] text-center'>
									{project.title}
								</div>
								<div className='w-[40%] text-center overflow-auto'>
									{project.assigned.length}
								</div>
								<div className='w-[15%] flex justify-center items-center'>
									{project.completed ? (
										<FiCheckCircle />
									) : (
										<FiCircle />
									)}
								</div>
								<div
									className='w-[5%] flex justify-center items-center relative hover:cursor-pointer'
									onClick={() =>
										setIsDropDownOpen((prev) =>
											prev === project._id
												? null
												: project._id,
										)
									}>
									<BsThreeDotsVertical />
									{isDropDownOpen === project._id && (
										<ul className='absolute z-10 right-6 top-6 w-48 bg-white border-2 text-gray-600 shadow-md rounded-md border-gray-100 p-2 mt-2'>
											<li
												onClick={() =>
													handleViewClick(project._id)
												}
												className='flex items-center w-full px-2 py-1 gap-2 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800'>
												View
											</li>
											<li
												onClick={() =>
													handleEditClick(project._id)
												}
												className='flex items-center w-full px-2 py-1 gap-2 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800'>
												Edit
											</li>
											<li
												onClick={() =>
													handleDeleteClick(
														project._id,
													)
												}
												className='flex items-center w-full px-2 py-1 gap-2 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800'>
												Delete
											</li>
										</ul>
									)}
								</div>
							</div>
						);
					})}
				</div>
				<div className='absolute bottom-4 right-4'>
					<button
						className='px-4 py-2 bg-[#3B71CA] text-white rounded-lg'
						onClick={handleNewClick}
						data-te-toggle='exampleModal'
						data-te-target='exampleModal'>
						+ Project
					</button>
				</div>
			</div>
		</div>
	);
};

export default AdminProjectView;
