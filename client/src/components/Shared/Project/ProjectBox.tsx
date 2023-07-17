import { Project } from "../../types";
import ActionDropdown from "../ActionDropdown";
import { BsThreeDotsVertical } from "react-icons/bs";

import { useState } from "react";

import { FiCheckCircle, FiCircle } from "react-icons/fi";
import { BiLock } from "react-icons/bi";

type Props = {
	project: Project;
	handleViewClick?: (id: string) => void;
	handleEditClick?: (id: string) => void;
	handleDeleteClick?: (id: string) => void;
	isAdminView: boolean;
};

const ProjectBox = ({
	project,
	handleEditClick,
	handleDeleteClick,
	handleViewClick,
	isAdminView,
}: Props) => {
	const [dropdown, setDropdown] = useState(false);

	return (
		<div
			key={project._id}
			className='flex justify-between w-full py-2 border-y'>
			<div className='w-[40%] text-center'>{project.title}</div>
			<div className='w-[40%] text-center overflow-auto'>
				{project.assigned.length}
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
					{dropdown &&
						handleViewClick &&
						handleEditClick &&
						handleDeleteClick && (
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
