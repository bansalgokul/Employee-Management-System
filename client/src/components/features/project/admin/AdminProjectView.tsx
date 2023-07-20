import EditProject from "./EditProject";
import { useEffect, useState } from "react";
import api from "../../../../api/api";
import ViewProject from "./ViewProject";
import Loading from "../../../Shared/Loading";
import { Project, Task, User } from "../../../types";
import Button from "../../../Shared/Button";
import ProjectBox from "../../../Shared/Project/ProjectBox";
import { useDebounce } from "../../../debounce";
import Pagination from "../../../Shared/Paginate";

type Props = {
	taskList: Task[];
	setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
	projectList: Project[];
	setProjectList: React.Dispatch<React.SetStateAction<Project[]>>;
	userList: User[];
	setUserList: React.Dispatch<React.SetStateAction<User[]>>;
};

const AdminProjectView = ({
	taskList,
	setTaskList,
	projectList,
	setProjectList,
	userList,
	setUserList,
}: Props) => {
	const [isEditorOpen, setIsEditorOpen] = useState<
		Project | null | undefined
	>(null);
	const [isViewProjectOpen, setIsViewProjectOpen] = useState<Project | null>(
		null,
	);
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search, 350);
	const [displayProjectList, setDisplayProjectList] = useState<Project[]>([]);
	const [loading, setLoading] = useState(false);
	const [isChange, setIsChange] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState(5);
	const [totalCount, setTotalCount] = useState(0);

	const onPageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber);
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
	const handleDeleteClick = async (id: string) => {
		const url = `/admin/project/${id}`;
		const response = await api.delete(url);
		if (response.status === 200) {
			const newList = [...projectList];
			setDisplayProjectList(
				newList.filter((project) => project._id !== id),
			);
		}
	};
	const handleNewClick = () => {
		setIsEditorOpen(undefined);
	};

	useEffect(() => {
		setLoading(true);
		async function searchProject() {
			const searchString = debouncedSearch;

			const projectResponse = await api.get(
				`/admin/project/?search=${searchString}&skip=${
					(currentPage - 1) * limit
				}&limit=${limit}`,
			);
			if (projectResponse.status === 200) {
				setTotalCount(projectResponse.data.totalRecords);
				projectResponse.data.projectDocs.forEach(
					(project: Project) =>
						(project.assigned = project.assigned.filter(
							(p) => p.user?._id,
						)),
				);
				setDisplayProjectList(projectResponse.data.projectDocs);
				setLoading(false);
			}
		}
		searchProject();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, limit]);

	useEffect(() => {
		setLoading(true);
		async function searchProject() {
			const searchString = debouncedSearch;
			setCurrentPage(1);
			const projectResponse = await api.get(
				`/admin/project/?search=${searchString}&skip=${0}&limit=${limit}`,
			);
			if (projectResponse.status === 200) {
				setTotalCount(projectResponse.data.totalRecords);
				projectResponse.data.projectDocs.forEach(
					(project: Project) =>
						(project.assigned = project.assigned.filter(
							(p) => p.user?._id,
						)),
				);
				setDisplayProjectList(projectResponse.data.projectDocs);
				setLoading(false);
			}
		}
		searchProject();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch, isChange]);

	return (
		<div className='flex justify-center h-full px-4 w-full relative bg-white shadow-lg rounded-md p-4'>
			{loading ? (
				<Loading />
			) : (
				<div className='flex flex-col gap-2 w-full h-full'>
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
							setIsChange={setIsChange}
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
					<div className='flex flex-col border-b-4 overflow-auto grow'>
						{totalCount === 0 ? (
							<div className='text-2xl font-semibold w-full h-full grid place-content-center'>
								{" "}
								No Projects Found
							</div>
						) : (
							<>
								{displayProjectList.map((project) => {
									return (
										<ProjectBox
											key={project._id}
											project={project}
											handleViewClick={handleViewClick}
											handleEditClick={handleEditClick}
											handleDeleteClick={
												handleDeleteClick
											}
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
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminProjectView;
