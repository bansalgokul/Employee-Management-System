import { useEffect, useState } from "react";
import api from "../../../../api/api";
import AddUser from "./AddUser";
import EditUser from "./EditUser";
import { User } from "../../../types";
import Loading from "../../../Shared/Loading";
import Button from "../../../Shared/Button";

import UserBox from "../common/UserBox";
import { useDebounce } from "../../../Shared/debounce";

import Pagination from "../../../Shared/Paginate";

const UserView = () => {
	const [userList, setUserList] = useState<User[]>([]);
	const [isNewUserOpen, setIsNewUserOpen] = useState(false);
	const [isEditorOpen, setIsEditorOpen] = useState<User | null>(null);
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search);
	const [loading, setLoading] = useState(true);

	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState(5);
	const [totalCount, setTotalCount] = useState(0);
	const [isChanged, setIsChanged] = useState(false);

	const handleLimitChange = (newLimit: number) => {
		setLimit(newLimit);
	};

	const onPageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		fetchUsers(debouncedSearch, (pageNumber - 1) * limit, limit);
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

	const fetchUsers = async (search: string, skip: number, limit: number) => {
		const userResponse = await api.get(
			`/admin/user/?search=${search}&skip=${skip}&limit=${limit}`,
		);
		if (userResponse.status === 200) {
			setTotalCount(userResponse.data.totalRecords);
			setUserList(userResponse.data.userDocs);
			setLoading(false);
		}
	};

	useEffect(() => {
		setLoading(true);
		setCurrentPage(1);
		fetchUsers(debouncedSearch, 0, limit);
	}, [debouncedSearch, isChanged, limit]);

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
							setIsChanged={setIsChanged}
						/>
					)}
					{isEditorOpen && (
						<EditUser
							user={isEditorOpen}
							setIsEditorOpen={setIsEditorOpen}
							setIsChanged={setIsChanged}
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
								{userList.map((user) => {
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
							handleLimitChange={handleLimitChange}
							limitRange={[5, 10, 15]}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default UserView;
