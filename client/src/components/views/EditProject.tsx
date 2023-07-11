import { useEffect, useRef, useState } from "react";
import { Project, Task } from "../user/UserRoute";
import api from "../../api/api";
import { User } from "../../App";
import {
	BiCheckSquare,
	BiCheckbox,
	BiCheckboxChecked,
	BiCross,
} from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { GrClose } from "react-icons/gr";
import { Select, initTE } from "tw-elements";

type Props = {
	project: Project;
	projectList: Project[];
	setProjectList: React.Dispatch<React.SetStateAction<Project[]>>;
	setIsEditorOpen: React.Dispatch<React.SetStateAction<Project | null>>;
	userList: User[];
};

const EditProject = ({
	projectList,
	setProjectList,
	setIsEditorOpen,
	project,
	userList,
}: Props) => {
	const [description, setDescription] = useState(project.description);
	const [title, setTitle] = useState(project.title);
	const [assigned, setAssigned] = useState(project.assigned);
	const [completed, setCompleted] = useState(project.completed);
	const navigate = useNavigate();

	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		ref.current?.scrollIntoView({
			behavior: "smooth",
			block: "end",
			inline: "nearest",
		});
		initTE({ Select });
	}, []);

	const handleSave = async () => {
		if (description.length === 0) {
			return alert("description cannot be empty");
		}

		const editedProject = {
			_id: project._id,
			title,
			description,
			assignees: assigned,
			completed: completed,
		};

		const response = await api.put("/admin/project", editedProject);
		if (response.status === 200) {
			setProjectList(
				projectList.map((p) => {
					if (p._id !== project._id) {
						return p;
					}
					return response.data.projectDoc;
				}),
			);
		}

		setIsEditorOpen(null);
	};

	const handleCancel = () => {
		setIsEditorOpen(null);
	};

	function handleUserCheck(user: User): void {
		const userFound = assigned.find((u) => u.user._id === user._id);
		if (userFound) {
			setAssigned(assigned.filter((u) => u.user._id !== user._id));
		} else {
			setAssigned([...assigned, { user }]);
		}
	}

	return (
		<div
			ref={ref}
			className='fixed w-[100%] h-[100%] top-0 left-0 grid place-content-center'>
			<div className='bg-[#f8f8f8] flex flex-col p-4 rounded-xl w-[500px]'>
				<div className='flex justify-between items-center pb-2 border-b-2'>
					<div className='text-2xl font-semibold'>Edit Project</div>
					<div>
						<button
							className=' rounded-md p-2 px-4 text-black'
							onClick={handleCancel}>
							<GrClose />
						</button>
					</div>
				</div>
				<div className=' flex h-[300px] flex-col  w-full bg-[#f8f8f8] p-4 gap-4 justify-start rounded-md relative'>
					<div className='flex justify-between gap-6 items-center'>
						<label htmlFor='title' className='w-[80px] text-center'>
							Title
						</label>
						<input
							type='text'
							name='title'
							id='title'
							placeholder='Title'
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className='w-[320px] p-2 rounded-md'
						/>
					</div>
					<div className='flex gap-6 items-center justify-between'>
						<label
							htmlFor='description'
							className='w-[80px] text-center'>
							Description:{" "}
						</label>
						<textarea
							name='description'
							id='description'
							value={description}
							rows={3}
							onChange={(e) => setDescription(e.target.value)}
							className='w-[320px] p-2 rounded-md'></textarea>
					</div>
					<div className='flex gap-6 items-center justify-between'>
						<label htmlFor='assigned' className='w-1/5 text-center'>
							Assigned:{" "}
						</label>

						<select
							data-te-select-init
							data-te-select-filter='true'
							multiple
							className='hidden bg-white p-2 text-black bg-opacity-100'>
							{userList.map((user) => {
								return (
									<option
										value={user._id}
										key={user._id}
										className='bg-[#f8f8f8] p-2 items-center rounded-md'>
										{user.name}
									</option>
								);
							})}
						</select>
					</div>
					<div className='flex gap-6 items-center'>
						<label
							htmlFor='completed'
							className='w-1/5 text-center'>
							Completed:
						</label>

						<div className='w-1/2 p-2 rounded-md'>
							<div
								className='w-[20%] text-4xl font-light text-[#3B71CA]'
								onClick={() => setCompleted((prev) => !prev)}>
								{completed ? (
									<BiCheckboxChecked />
								) : (
									<BiCheckbox />
								)}
							</div>
						</div>
					</div>
				</div>
				<div className='flex justify-end gap-2 border-t-2 pt-4'>
					<div>
						<button
							className='text-[#3B71CA] shadow-md rounded-md p-1 px-4 bg-[#e0e0e0] font-semibold'
							onClick={handleCancel}>
							Cancel
						</button>
					</div>
					<div>
						<button
							className='bg-[#3B71CA] shadow-md rounded-md p-1 px-4 text-white font-semibold'
							onClick={handleSave}>
							Save
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditProject;
