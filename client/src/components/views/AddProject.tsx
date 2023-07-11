import { useEffect, useRef, useState } from "react";
import { Project } from "../user/UserRoute";
import api from "../../api/api";
import { User } from "../../App";
import { BiCheckbox, BiCheckboxChecked } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

type Props = {
	projectList: Project[];
	setProjectList: React.Dispatch<React.SetStateAction<Project[]>>;
	setIsNewProjectOpen: React.Dispatch<React.SetStateAction<boolean>>;
	userList: User[];
};

const AddProject = ({
	projectList,
	setProjectList,
	setIsNewProjectOpen,
	userList,
}: Props) => {
	const [description, setDescription] = useState("");
	const [title, setTitle] = useState("");
	const [assigned, setAssigned] = useState<
		Array<{
			user: User;
		}>
	>([]);
	const [completed, setCompleted] = useState(false);
	const navigate = useNavigate();

	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		ref.current?.scrollIntoView({
			behavior: "smooth",
			block: "end",
			inline: "nearest",
		});
	}, []);

	const handleSave = async () => {
		if (title.length === 0) {
			return alert("title cannot be empty");
		}
		if (description.length === 0) {
			return alert("description cannot be empty");
		}

		const newProject = {
			title,
			description,
			assignees: assigned,
			completed: completed,
		};

		const response = await api.post("/admin/project", newProject);
		if (response.status === 201) {
			setProjectList([...projectList, response.data.projectDoc]);
		}

		setIsNewProjectOpen(false);
	};

	const handleCancel = () => {
		setIsNewProjectOpen(false);
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
		<div ref={ref}>
			<div className=' flex flex-col  w-full bg-[#f8f8f8] p-4 gap-4 justify-between rounded-md relative'>
				<div className='flex gap-6 items-center'>
					<label htmlFor='title' className='w-1/5 text-center'>
						Title
					</label>
					<input
						type='text'
						name='title'
						id='title'
						placeholder='Title'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className='w-1/2 p-2 rounded-md'
					/>
				</div>
				<div className='flex gap-6 items-center'>
					<label htmlFor='description' className='w-1/5 text-center'>
						Description:{" "}
					</label>
					<input
						name='description'
						id='description'
						type='text'
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className='w-1/2 p-2 rounded-md'></input>
				</div>
				<div className='flex gap-6 items-center'>
					<label htmlFor='assigned' className='w-1/5 text-center'>
						Assigned:{" "}
					</label>

					<div className='bg-white w-[200px] p-2 flex flex-col gap-2 rounded-lg max-h-[200px] overflow-auto'>
						{userList.map((user) => {
							const checked = assigned.find(
								(u) => u.user._id === user._id,
							)
								? true
								: false;

							return (
								<div
									key={user._id}
									className='flex bg-[#f8f8f8] p-2 items-center rounded-md'>
									<div
										className='w-[80%] hover:cursor-pointer'
										onClick={() =>
											navigate(
												`/admin?userID=${user._id}`,
											)
										}>
										{user.name}
									</div>
									<div
										className='w-[20%] text-3xl font-light text-[#3B71CA]'
										onClick={() => handleUserCheck(user)}>
										{checked ? (
											<BiCheckboxChecked />
										) : (
											<BiCheckbox />
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
				<div className='flex gap-6 items-center'>
					<label htmlFor='completed' className='w-1/5 text-center'>
						Completed:
					</label>
					<div className='w-1/2 p-2 rounded-md'>
						<div
							className='w-[20%] text-4xl font-light text-[#3B71CA]'
							onClick={() => setCompleted((prev) => !prev)}>
							{completed ? <BiCheckboxChecked /> : <BiCheckbox />}
						</div>
					</div>
				</div>
				<div className='absolute bottom-4 right-4 flex gap-4'>
					<div>
						<button
							className='bg-[#3B71CA] rounded-md p-2 px-4 text-white'
							onClick={handleCancel}>
							Cancel
						</button>
					</div>
					<div>
						<button
							className='bg-[#3B71CA] rounded-md p-2 px-4 text-white'
							onClick={handleSave}>
							Save
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddProject;
