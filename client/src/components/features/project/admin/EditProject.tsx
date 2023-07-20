import { useEffect, useState } from "react";
import api from "../../../../api/api";
import { BiCheckbox, BiCheckboxChecked } from "react-icons/bi";
import { GrClose } from "react-icons/gr";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import Loading from "../../../Shared/Loading";
import { Project, User } from "../../../types";
import Button from "../../../Shared/Button";

type Props = {
	project: Project | undefined;

	setIsEditorOpen: React.Dispatch<
		React.SetStateAction<Project | null | undefined>
	>;
	projectList: Project[];
	setProjectList: React.Dispatch<React.SetStateAction<Project[]>>;
	userList: User[];
	setUserList: React.Dispatch<React.SetStateAction<User[]>>;
	setIsChange: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditProject = ({
	setIsEditorOpen,
	project,
	projectList,
	setProjectList,
	userList,
	setUserList,
	setIsChange,
}: Props) => {
	const [description, setDescription] = useState("");
	const [title, setTitle] = useState("");
	const [assigned, setAssigned] = useState<
		Array<{
			user: User;
		}>
	>([]);
	const [completed, setCompleted] = useState(false);
	const [search, setSearch] = useState("");
	const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);

		async function getData() {
			try {
				if (project) {
					const projectResponse = await api.get(
						`/admin/project/?id=${project._id}`,
					);
					if (projectResponse.status === 200) {
						// eslint-disable-next-line react-hooks/exhaustive-deps
						project = projectResponse.data.projectDoc;

						if (project) {
							project.assigned = project.assigned.filter((u) => {
								return u.user !== null;
							});

							setTitle(project.title);
							setDescription(project.description);
							setAssigned(project.assigned);
							setCompleted(project.completed);
						}
					}
				}

				const userResponse = await api.get("/admin/user");
				if (userResponse.status === 200) {
					setUserList(userResponse.data.userDocs);
				}

				setLoading(false);
			} catch (error) {
				console.log("Error fetching data:", error);
			}
		}

		getData();
	}, []);

	const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (title.length === 0) {
			return alert("title cannot be empty");
		}

		if (description.length === 0) {
			return alert("description cannot be empty");
		}

		if (!project) {
			const newProject = {
				title,
				description,
				assignees: assigned,
				completed: completed,
			};

			const response = await api.post("/admin/project", newProject);
			if (response.status === 201) {
				setProjectList([...projectList, response.data.projectDoc]);
				setIsChange((prev) => !prev);
			}
		} else {
			const editedProject = {
				_id: project._id,
				title,
				description,
				assignees: assigned,
				completed: completed,
			};

			const response = await api.put("/admin/project", editedProject);
			if (response.status === 200) {
				setIsChange((prev) => !prev);
				setProjectList(
					projectList.map((p) => {
						if (p._id !== project?._id) {
							return p;
						}
						return response.data.projectDoc;
					}),
				);
			}
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
			onClick={handleCancel}
			className='z-30 top-0 left-0 bg-[#f5f5f5] bg-opacity-50 fixed w-full h-full grid place-content-center'>
			{loading ? (
				<Loading />
			) : (
				<div
					onClick={(e) => {
						e.stopPropagation();
						setIsUserDropdownOpen(false);
					}}
					className='border-2 p-4 rounded-md bg-white w-[470px] h-[400px] flex flex-col justify-between'>
					<div className=' flex text-xl font-semibold justify-between  items-center'>
						<div className='px-3 pb-2'>
							{project ? "EDIT PROJECT" : "ADD PROJECT"}
						</div>
						<div
							onClick={handleCancel}
							className='hover:cursor-pointer px-3 pb-2'>
							<GrClose />
						</div>
					</div>
					<div className='grow py-2 border-y-2'>
						<form
							id='editProjectForm'
							className='w-full flex flex-col gap-2 relative'
							onSubmit={(e) => handleSave(e)}>
							<div className='flex items-center'>
								<label
									htmlFor='title'
									className='w-[120px] text-center'>
									Title
								</label>
								<input
									type='text'
									name='title'
									id='title'
									placeholder='Title'
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									className='px-3 py-2 bg-[#f5f5f5]	w-[300px] rounded-xl'
								/>
							</div>
							<div className='flex items-center '>
								<label
									htmlFor='description'
									className='w-[120px] text-center'>
									Description:{" "}
								</label>
								<textarea
									name='description'
									id='description'
									value={description}
									rows={3}
									onChange={(e) =>
										setDescription(e.target.value)
									}
									className='px-3 py-2 bg-[#f5f5f5]	w-[300px] rounded-xl'></textarea>
							</div>
							<div className='flex items-center'>
								<label
									htmlFor='assigned'
									className='w-[120px] text-center'>
									Assigned:{" "}
								</label>

								<div
									className='px-3 py-2 bg-[#f5f5f5]	w-[300px] rounded-xl relative'
									onClick={(e) => e.stopPropagation()}>
									<div
										onClick={() =>
											setIsUserDropdownOpen(
												(prev) => !prev,
											)
										}
										className='flex justify-between hover:cursor-pointer items-center'>
										<div>Select Assigned</div>
										<div>
											{isUserDropdownOpen ? (
												<BsChevronUp />
											) : (
												<BsChevronDown />
											)}
										</div>
									</div>
									{isUserDropdownOpen && (
										<div className='absolute z-10 bg-[#f5f5f5] rounded-b-md w-full left-0 px-3 py-1'>
											<div>
												<input
													type='text'
													value={search}
													onChange={(e) =>
														setSearch(
															e.target.value,
														)
													}
													placeholder='Search User'
													className='px-3 py-1 bg-[#fafafa] mb-1 text-black border-2 rounded-lg'
												/>
											</div>
											<div className='overflow-auto  h-[200px]'>
												{userList
													.filter((user) =>
														user.name
															.toLowerCase()
															.includes(
																search.toLowerCase(),
															),
													)
													.map((user) => {
														return (
															<div
																key={user._id}
																className='flex justify-between border-b hover:cursor-pointer p-2 items-center'
																onClick={() =>
																	handleUserCheck(
																		user,
																	)
																}>
																<div>
																	{user.name}
																</div>
																<div className='text-2xl'>
																	{assigned.find(
																		(u) =>
																			u
																				?.user
																				?._id ===
																			user._id,
																	) ? (
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
									)}
								</div>
							</div>
							<div className='flex items-center'>
								<label
									htmlFor='completed'
									className='w-[120px] text-center'>
									Completed:
								</label>

								<button
									className='px-3 py-2 text-4xl font-light text-[#3B71CA]	w-[300px] rounded-xl'
									type='button'
									onClick={() =>
										setCompleted((prev) => !prev)
									}>
									{completed ? (
										<BiCheckboxChecked />
									) : (
										<BiCheckbox />
									)}
								</button>
							</div>
						</form>
					</div>

					<div className='flex justify-end gap-2 border-t-2 pt-4'>
						<div>
							<Button name='Cancel' onClick={handleCancel} />
						</div>
						<div>
							<Button
								name='Save'
								type='submit'
								form='editProjectForm'
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default EditProject;
