import EditProject from "./EditProject";
import { useEffect, useState } from "react";
import api from "../../../../api/api";
import ViewProject from "./ViewProject";
import Loading from "../../../Shared/Loading";
import { Project } from "../../../types";
import Button from "../../../Shared/Button";
import ProjectBox from "../common/ProjectBox";
import { useDebounce } from "../../../Shared/debounce";
import Pagination from "../../../Shared/Paginate";
import { BsChevronUp, BsChevronDown } from "react-icons/bs";
import { isAxiosError } from "axios";
import ErrorPrompt from "../../../Shared/ErrorPrompt";
import ConfirmPrompt from "../../../Shared/ConfirmPrompt";

const AdminProjectView = () => {
	const [projectList, setProjectList] = useState<Project[]>([]);
	const [isEditorOpen, setIsEditorOpen] = useState<
		Project | null | undefined
	>(null);
	const [isViewProjectOpen, setIsViewProjectOpen] = useState<Project | null>(
		null,
	);
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search, 350);
	const [loading, setLoading] = useState(false);
	const [isChange, setIsChange] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState(5);
	const [totalCount, setTotalCount] = useState(0);
	const [status, setStatus] = useState("active");

	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const onPageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		fetchProjects(debouncedSearch, (pageNumber - 1) * limit, limit, status);
	};
	const handleLimitChange = (newLimit: number) => {
		setLimit(newLimit);
	};

	const projectID = new URLSearchParams(location.search).get("target");

	useEffect(() => {
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

	const [confirmPrompt, setConfirmPrompt] = useState<string | null>("");
	const [confirmMessage, setConfirmMessage] = useState("");

	const cancelFunction = () => {
		setConfirmPrompt(null);
	};

	const handleDeleteClick = async (id: string) => {
		setConfirmPrompt(id);
		setConfirmMessage("Are you sure, you want to delete your project ?");
	};

	const handleDeletePrompt = async (id: string) => {
		try {
			const url = `/admin/project/${id}`;
			await api.delete(url);
			setIsChange((prev) => !prev);
		} catch (err) {
			if (isAxiosError(err)) {
				setShowError(true);
				setErrorMessage(err.response?.data?.error);
			} else {
				console.log(err);
			}
		}
	};

	const handleNewClick = () => {
		setIsEditorOpen(undefined);
	};

	const handleArchiveClick = async () => {
		const editedProject = {
			_id: id,
			status: "archived",
		};

		const response = await api.put("/admin/project", editedProject);
		if (response.status === 200) {
			setIsChange((prev) => !prev);
		}
	};

	const handleUnarchiveClick = async (id: string) => {
		const editedProject = {
			_id: id,
			status: "active",
		};

		const response = await api.put("/admin/project", editedProject);
		if (response.status === 200) {
			setIsChange((prev) => !prev);
		}
	};

	const fetchProjects = async (
		search: string,
		skip: number,
		limit: number,
		status: string,
	) => {
		const projectResponse = await api.get(
			`/admin/project/?search=${search}&skip=${skip}&limit=${limit}&status=${status}`,
		);
		if (projectResponse.status === 200) {
			setTotalCount(projectResponse.data.totalRecords);
			projectResponse.data.projectDocs.forEach(
				(project: Project) =>
					(project.assigned = project.assigned.filter(
						(p) => p.user?._id,
					)),
			);
			setProjectList(projectResponse.data.projectDocs);
			setLoading(false);
		}
	};

	const closeErrorPrompt = () => {
		setShowError(false);
		setErrorMessage("");
	};

	const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

	useEffect(() => {
		setLoading(true);
		setCurrentPage(1);
		fetchProjects(debouncedSearch, 0, limit, status);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch, isChange, limit, status]);

	return (
		<div className='flex justify-center h-full px-4 w-full relative bg-white shadow-lg rounded-md p-4'>
			{loading ? (
				<Loading />
			) : (
				<div className='flex flex-col gap-2 w-full h-full'>
					{showError && (
						<ErrorPrompt
							error={errorMessage}
							closeErrorPrompt={closeErrorPrompt}
						/>
					)}
					{confirmPrompt && (
						<ConfirmPrompt
							confirmFunction={handleDeletePrompt}
							id={confirmPrompt}
							message={confirmMessage}
							cancelFunction={cancelFunction}
						/>
					)}
					<div className='flex justify-between px-4 items-center py-1'>
						<input
							type='text'
							className='px-3 py-2 bg-[#f5f5f5]	w-1/2 rounded-xl'
							placeholder='Search Project'
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<div className='flex items-center gap-2'>
							<label
								htmlFor='assigned'
								className='w-[50px] text-center'>
								Status:{" "}
							</label>

							<div
								className='px-3 py-2 bg-[#f5f5f5]	w-[120px] rounded-xl relative'
								onClick={(e) => e.stopPropagation()}>
								<div
									onClick={() =>
										setIsStatusDropdownOpen((prev) => !prev)
									}
									className='flex justify-between hover:cursor-pointer items-center'>
									<div>{status}</div>
									<div>
										{isStatusDropdownOpen ? (
											<BsChevronUp />
										) : (
											<BsChevronDown />
										)}
									</div>
								</div>
								{isStatusDropdownOpen && (
									<div className='absolute z-10 bg-[#f5f5f5] rounded-b-md w-full left-0 px-3 py-1'>
										<div>
											<option
												onClick={(e) => {
													setIsStatusDropdownOpen(
														false,
													);
													setStatus(
														e.currentTarget.value,
													);
												}}
												value='active '
												className='flex justify-between border-b hover:cursor-pointer p-2 items-center'>
												Active
											</option>
											<option
												onClick={(e) => {
													setIsStatusDropdownOpen(
														false,
													);
													setStatus(
														e.currentTarget.value,
													);
												}}
												value='archived'
												className='flex justify-between border-b hover:cursor-pointer p-2 items-center'>
												Archived
											</option>
										</div>
									</div>
								)}
							</div>
						</div>
						<Button name='+ Add' onClick={handleNewClick} />
					</div>
					{isViewProjectOpen && (
						<ViewProject
							project={isViewProjectOpen}
							setIsViewProjectOpen={setIsViewProjectOpen}
						/>
					)}
					{isEditorOpen !== null && (
						<EditProject
							project={isEditorOpen}
							setIsEditorOpen={setIsEditorOpen}
							setIsChange={setIsChange}
						/>
					)}
					<div>
						<div className='flex justify-between w-full'>
							<div className='w-[30%] text-center'>Title</div>
							<div className='w-[30%] text-center'>Assigned</div>
							<div className='w-[20%] text-center'>Status</div>
							<div className='w-[15%] text-center'>Completed</div>
							<div className='w-[5%] text-center'></div>
						</div>
					</div>
					<div className='flex flex-col border-b-4 overflow-auto grow'>
						{totalCount === 0 ? (
							<div className='text-2xl font-semibold w-full h-full grid place-content-center'>
								{" "}
								No Projects Found
							</div>
						) : (
							<>
								{projectList.map((project) => {
									return (
										<ProjectBox
											key={project._id}
											project={project}
											isAdminView={true}
										/>
									);
								})}
							</>
						)}
					</div>
					<div className='flex justify-center gap-4 items-center'>
						<Pagination
							currentPage={currentPage}
							pageSize={limit}
							totalCount={totalCount}
							onPageChange={onPageChange}
							handleLimitChange={handleLimitChange}
							limitRange={[5, 10, 15]}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminProjectView;
