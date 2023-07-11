import { useEffect, useState } from "react";
import api from "../../api/api";
import { User } from "../../App";
import { BsThreeDotsVertical } from "react-icons/bs";

type Props = {
	userList: User[];
	setUserList: React.Dispatch<React.SetStateAction<User[]>>;
};

const UserView = ({ userList, setUserList }: Props) => {
	return (
		<div className='flex justify-center h-full px-4 w-full relative bg-white shadow-lg rounded-md p-4'>
			<div className='flex flex-col gap-2 w-full h-full overflow-auto'>
				<div>
					<div className='flex justify-between w-full'>
						<div className='w-[450px]'>Name</div>
						<div className='w-[180px] text-center'>Employee ID</div>
						<div className='w-[180px] text-center'>Role</div>
						<div className='w-[50px]'></div>
					</div>
				</div>
				<div className='flex flex-col border-b-4'>
					{userList.map((user) => {
						return (
							<div className='flex justify-between items-center w-full py-2 border-y'>
								<div className='w-[450px]'>{user.name}</div>
								<div className='w-[180px] text-center'>
									{user.empID}
								</div>
								<div className='w-[180px] text-center'>
									{user.roles}
								</div>
								<div className='w-[50px]'>
									<BsThreeDotsVertical />
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default UserView;
