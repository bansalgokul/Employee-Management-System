import { useEffect, useState } from "react";
import api from "../../../../api/api";
import AddUser from "./AddUser";
import EditUser from "./EditUser";
import { User } from "../../../types";
import Loading from "../../../Shared/Loading";
import Button from "../../../Shared/Button";

import UserBox from "../../../Shared/User/UserBox";
import { useDebounce } from "../../../debounce";

import Pagination from "../../../Shared/Paginate";

type Props = {
	userList: User[];
	setUserList: React.Dispatch<React.SetStateAction<User[]>>;
};

const UserView = ({ userList, setUserList }: Props) => {
	const [displayUserList, setDisplayUserList] = useState<User[]>([]);
	const [isNewUserOpen, setIsNewUserOpen] = useState(false);
	const [isEditorOpen, setIsEditorOpen] = useState<User | null>(null);
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search);
	const [loading, setLoading] = useState(true);

	const [currentPage, setCurrentPage] = useState(1);
	const [limit] = useState(5);
	const [totalCount, setTotalCount] = useState(0);

	const onPageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};

	const handleEditClick = (id: string) => {
		const user = userList.find((user) => user._id === id);
		if (user) {
			setIsEditorOpen(user);
		}
	};
	const handleDeleteClick = async (id: string) => {
		const url = `/admin/user/${id}`;
		const response = await api.delete(url);
		if (response.status === 200) {
			setUserList((prevList) =>
				prevList.filter((user) => user._id !== id),
			);
		}
	};

	const handleAddClick = () => {
		setIsNewUserOpen(true);
	};

	useEffect(() => {
		setLoading(true);
		const handleSearch = async () => {
			const searchString = debouncedSearch;
			const userResponse = await api.get(
				`/admin/user/?search=${searchString}&skip=${
					(currentPage - 1) * limit
				}&limit=${limit}`,
			);
			if (userResponse.status === 200) {
				setTotalCount(userResponse.data.totalRecords);
				setDisplayUserList(userResponse.data.userDocs);
				setLoading(false);
			}
		};
		handleSearch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [limit, currentPage]);

	useEffect(() => {
		setLoading(true);
		setCurrentPage(1);
		const handleSearch = async () => {
			const searchString = debouncedSearch;
			const userResponse = await api.get(
				`/admin/user/?search=${searchString}&skip=${0}&limit=${limit}`,
			);
			if (userResponse.status === 200) {
				setTotalCount(userResponse.data.totalRecords);
				setDisplayUserList(userResponse.data.userDocs);
				setLoading(false);
			}
		};
		handleSearch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch, userList]);

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
							placeholder='Search User'
							autoFocus
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<Button name='+ Add' onClick={handleAddClick} />
					</div>
					{isNewUserOpen && (
						<AddUser
							setIsNewUserOpen={setIsNewUserOpen}
							userList={userList}
							setUserList={setUserList}
						/>
					)}
					{isEditorOpen && (
						<EditUser
							user={isEditorOpen}
							setIsEditorOpen={setIsEditorOpen}
							userList={userList}
							setUserList={setUserList}
						/>
					)}
					<div>
						<div className='flex justify-between w-full'>
							<div className='w-[320px]'>Name</div>
							<div className='w-[250px] text-center'>Email</div>
							<div className='w-[180px] text-center'>
								Employee ID
							</div>
							<div className='w-[180px] text-center'>Role</div>
							<div className='w-[50px]'></div>
						</div>
					</div>
					<div className='flex flex-col border-b-4 h-[560px] overflow-auto'>
						{totalCount === 0 ? (
							<div className='text-2xl font-semibold w-full h-full grid place-content-center'>
								{" "}
								No User Found
							</div>
						) : (
							<>
								{displayUserList.map((user) => {
									return (
										<UserBox
											key={user._id}
											user={user}
											handleDeleteClick={
												handleDeleteClick
											}
											handleEditClick={handleEditClick}
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

export default UserView;
