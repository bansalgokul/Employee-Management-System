import { Project } from "../../../types";
import ActionDropdown from "../../../Shared/ActionDropdown";
import { BsThreeDotsVertical } from "react-icons/bs";

import { useState } from "react";

import { FiCheckCircle, FiCircle } from "react-icons/fi";
import { BiLock } from "react-icons/bi";
import EditProject from "../admin/EditProject";
import ViewProject from "../admin/ViewProject";
import api from "../../../../api/api";
import ConfirmPrompt from "../../../Shared/ConfirmPrompt";
import { isAxiosError } from "axios";
import ErrorPrompt from "../../../Shared/ErrorPrompt";

type Props = {
	project: Project;
	isAdminView: boolean;
	setIsChange: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProjectBox = ({ project, isAdminView, setIsChange }: Props) => {
	const [dropdown, setDropdown] = useState(false);
	const [isViewProject, setIsViewProject] = useState(false);
	const [isEditProject, setIsEditProject] = useState(false);
	const [isDeleteProject, setIsDeleteProject] = useState(false);
	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const handleEditClick = () => {
		setIsEditProject(true);
	};
	const handleViewClick = () => {
		setIsViewProject(true);
	};
	const handleDeleteClick = () => {
		setIsDeleteProject(true);
	};

	const deleteProject = async () => {
		try {
			const url = `/admin/project/${project._id}`;
			await api.delete(url);
			setIsChange((prev) => !prev);
		} catch (err) {
			if (isAxiosError(err)) {
				setShowError(true);
				setErrorMessage(err.response?.data?.error);
				// console.log(err.response?.data?.error);
			} else {
				console.log(err);
			}
		}
	};

	const handleArchiveClick = async () => {
		const editedProject = {
			_id: project._id,
			status: "archived",
		};

		const response = await api.put("/admin/project", editedProject);
		if (response.status === 200) {
			setIsChange((prev) => !prev);
		}
	};

	const handleUnarchiveClick = async () => {
		const editedProject = {
			_id: project._id,
			status: "active",
		};

		const response = await api.put("/admin/project", editedProject);
		if (response.status === 200) {
			setIsChange((prev) => !prev);
		}
	};

	const closeErrorPrompt = () => {
		setShowError(false);
		setErrorMessage("");
		setIsDeleteProject(false);
	};

	return (
		<div
			key={project._id}
			className='flex justify-between w-full py-2 border-y'>
			{isViewProject && (
				<ViewProject
					project={project}
					setIsViewProject={setIsViewProject}
				/>
			)}
			{isEditProject && (
				<EditProject
					project={project}
					setIsEditProject={setIsEditProject}
					setIsChange={setIsChange}
				/>
			)}
			{isDeleteProject && (
				<ConfirmPrompt
					setIsDeleteProject={setIsDeleteProject}
					deleteProject={deleteProject}
					message='Are you sure, You want to delete the project ?'
				/>
			)}
			{showError && (
				<ErrorPrompt
					error={errorMessage}
					closeErrorPrompt={closeErrorPrompt}
				/>
			)}
			<div className='w-[30%] text-center'>{project.title}</div>
			<div className='w-[30%] text-center overflow-auto'>
				{project.assigned.length}
			</div>
			<div className='w-[20%] text-center overflow-auto'>
				{project.status}
			</div>
			<div className='w-[15%] flex justify-center items-center'>
				{project.completed ? <FiCheckCircle /> : <FiCircle />}
			</div>
			{!isAdminView ? (
				<div className='w-[5%] flex justify-center items-center relative'>
					<BiLock />
				</div>
			) : (
				<div
					className='w-[5%] flex justify-center items-center relative hover:cursor-pointer'
					onClick={() => setDropdown((prev) => !prev)}>
					<BsThreeDotsVertical />
					{dropdown && (
						<ActionDropdown
							openActionItems={[
								{
									name: "View",
									id: project._id,
									onClick: handleViewClick,
								},
								{
									name: "Edit",
									id: project._id,
									onClick: handleEditClick,
								},
								{
									name:
										project.status === "active"
											? "Archive"
											: "Unarchive",
									id: project._id,
									onClick:
										project.status === "active"
											? handleArchiveClick
											: handleUnarchiveClick,
								},
								{
									name: "Delete",
									id: project._id,
									onClick: handleDeleteClick,
								},
							]}
							setDropdown={setDropdown}
						/>
					)}
				</div>
			)}
		</div>
	);
};

export default ProjectBox;
