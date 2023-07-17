import { useEffect, useState } from "react";
import api from "../../../../api/api";
import { BsThreeDotsVertical } from "react-icons/bs";
import AddUser from "./AddUser";
import EditUser from "./EditUser";
import { User } from "../../../types";
import Loading from "../../../Shared/Loading";
import ActionDropdown from "../../../Shared/ActionDropdown";
import Button from "../../../Shared/Button";

type Props = {
	userList: User[];
	setUserList: React.Dispatch<React.SetStateAction<User[]>>;
};

const UserView = ({ userList, setUserList }: Props) => {
	const [isNewUserOpen, setIsNewUserOpen] = useState(false);
	const [isDropDownOpen, setIsDropDownOpen] = useState<string | null>(null);
	const [isEditorOpen, setIsEditorOpen] = useState<User | null>(null);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);

		async function getData() {
			try {
				const userResponse = await api.get("/admin/user");
				if (userResponse.status === 200) {
					setUserList(userResponse.data.userDocs);
				}
				setLoading(false);
			} catch (error) {
				console.log("Error fetching Projects:", error);
			}
		}

		getData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
			setUserList(userList.filter((user) => user._id !== id));
		}
	};

	const handleAddClick = () => {
		setIsNewUserOpen(true);
	};

	return (
		<div className='flex justify-center h-full px-4 w-full relative bg-white shadow-lg rounded-md p-4'>
			{loading ? (
				<Loading />
			) : (
				<div className='flex flex-col gap-2 w-full h-full overflow-auto'>
					<div className='flex justify-between px-4 items-center py-1'>
						<input
							type='text'
							className='px-3 py-2 bg-[#f5f5f5]	w-1/2 rounded-xl'
							placeholder='Search User'
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<Button name='+ Add' onClick={handleAddClick} />
					</div>
					{isNewUserOpen && (
						<AddUser
							userList={userList}
							setUserList={setUserList}
							setIsNewUserOpen={setIsNewUserOpen}
						/>
					)}
					{isEditorOpen && (
						<EditUser
							userList={userList}
							setUserList={setUserList}
							user={isEditorOpen}
							setIsEditorOpen={setIsEditorOpen}
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
					<div className='flex flex-col border-b-4'>
						{userList
							.filter((u) =>
								u.name
									.toLowerCase()
									.includes(search.toLowerCase()),
							)
							.map((user) => {
								return (
									<div
										key={user._id}
										className='flex justify-between items-center w-full py-2 border-y'>
										<div className='w-[320px]'>
											{user.name}
										</div>
										<div className='w-[250px] text-center'>
											{user.email}
										</div>
										<div className='w-[180px] text-center'>
											{user.empID}
										</div>
										<div className='w-[180px] text-center'>
											{user.roles}
										</div>
										<div
											className='w-[5%] flex justify-center items-center relative hover:cursor-pointer'
											onClick={() =>
												setIsDropDownOpen((prev) =>
													prev === user._id
														? null
														: user._id,
												)
											}>
											<BsThreeDotsVertical />
											{isDropDownOpen === user._id && (
												<ActionDropdown
													openActionItems={[
														{
															name: "Edit",
															id: user._id,
															onClick:
																handleEditClick,
														},
														{
															name: "Delete",
															id: user._id,
															onClick:
																handleDeleteClick,
														},
													]}
													setIsDropdownOpen={
														setIsDropDownOpen
													}
												/>
											)}
										</div>
									</div>
								);
							})}
					</div>
				</div>
			)}
		</div>
	);
};

export default UserView;
