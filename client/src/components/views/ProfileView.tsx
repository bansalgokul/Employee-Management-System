import { User } from "../../App";
import Profile from "../../assets/21666259.jpg";

type Props = {
	userInfo: User;
};

const ProfileView = ({ userInfo }: Props) => {
	return (
		<div className='w-full h-full relative bg-white shadow-lg rounded-md p-4 flex flex-col'>
			<div className='flex'>
				<div className=''>
					<img
						src={Profile}
						alt=''
						className='w-[60px] h-[60px] rounded-full'
					/>
				</div>
				<div>{userInfo.name}</div>
			</div>

			<div>{userInfo.email}</div>

			<div>{userInfo.empID}</div>
			<div>Change Password</div>

			<div className='absolute bottom-4 right-4'>
				<button>Save</button>
			</div>
		</div>
	);
};

export default ProfileView;
