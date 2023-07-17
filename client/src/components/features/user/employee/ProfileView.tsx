import Profile from "../../../../assets/21666259.jpg";
import { User } from "../../../types";

type Props = {
	userInfo: User;
};

const ProfileView = ({ userInfo }: Props) => {
	return (
		<div className='w-full h-full relative bg-white shadow-lg rounded-md p-4 flex flex-col font-semibold text-base'>
			<div className='flex gap-10'>
				<div className=''>
					<img
						src={Profile}
						alt=''
						className='w-[100px] h-[100px] rounded-full'
					/>
				</div>

				<div className='flex flex-col gap-4 w-[400px]'>
					<div className='bg-[#f5f5f5]  p-4 rounded-lg'>
						{userInfo.name}
					</div>
					<div className='bg-[#f5f5f5] p-4 rounded-lg'>
						{userInfo.email}
					</div>
					<div className='bg-[#f5f5f5] p-4 rounded-lg'>
						{userInfo.empID}
					</div>
					<div className='bg-[#3B71CA] w-fit text-white p-4 rounded-lg'>
						Change Password
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileView;
