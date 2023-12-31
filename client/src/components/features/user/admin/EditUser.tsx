import { useState } from "react";
import api from "../../../../api/api";
import { GrClose } from "react-icons/gr";
import { User } from "../../../types";
import Button from "../../../Shared/Button";

type Props = {
	user: User;
	setIsEditorOpen: React.Dispatch<React.SetStateAction<User | null>>;
	setIsChanged: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditUser = ({ user, setIsEditorOpen, setIsChanged }: Props) => {
	const [name, setName] = useState(user.name);
	const [email, setEmail] = useState(user.email);
	// const [password, setPassword] = useState();
	const [empID, setEmpID] = useState(user.empID.slice(4));
	const [roles, setRoles] = useState(user.roles);

	const handleCancel = () => {
		setIsEditorOpen(null);
	};

	const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const updatedUser = {
			_id: user._id,
			name,
			email,
			empID: `EMP-${empID}`,
			roles,
		};

		const response = await api.put("/admin/user", updatedUser);
		if (response.status === 200) {
			setIsChanged((prev) => !prev);
		}

		setIsEditorOpen(null);
	};

	return (
		<div
			className='z-30 top-0 left-0 bg-[#f5f5f5] bg-opacity-50 fixed w-full h-full grid place-content-center'
			onClick={handleCancel}>
			<div
				onClick={(e) => e.stopPropagation()}
				className='border-2 p-4 rounded-md bg-white w-[480px] h-[350px] flex flex-col justify-between'>
				<div className=' flex text-xl font-semibold justify-between  items-center'>
					<div className='px-3 pb-2'>EDIT USER</div>
					<div
						onClick={handleCancel}
						className='hover:cursor-pointer px-3 pb-2'>
						<GrClose />
					</div>
				</div>
				<div className='grow py-2 border-y-2'>
					<form
						id='editUserForm'
						className='w-full flex flex-col gap-3 relative'
						onSubmit={(e) => handleSave(e)}>
						<div className='flex items-center'>
							<label
								htmlFor='name'
								className='w-[120px] text-center'>
								Name:{" "}
							</label>
							<input
								type='text'
								name='name'
								id='name'
								value={name}
								onChange={(e) => setName(e.target.value)}
								className='px-3 py-2 bg-[#f5f5f5]	w-[300px] rounded-xl'
								required
							/>
						</div>
						<div className='flex items-center'>
							<label
								htmlFor='email'
								className='w-[120px] text-center'>
								Email:{" "}
							</label>
							<input
								type='email'
								name='email'
								id='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className='px-3 py-2 bg-[#f5f5f5]	w-[300px] rounded-xl'
								required
							/>
						</div>
						<div className='flex items-center'>
							<label
								htmlFor='empID'
								className='w-[120px] text-center'>
								Employee ID:{" "}
							</label>
							<div className='px-3 py-2 bg-[#f5f5f5] w-[52px] rounded-l-xl'>
								EMP-
							</div>
							<input
								type='text'
								name='empID'
								id='empID'
								value={empID}
								onChange={(e) => setEmpID(e.target.value)}
								className='px-3 py-2 bg-[#f5f5f5]	w-[250px] rounded-r-xl'
								required
							/>
						</div>
						<div className='flex items-center'>
							<label
								htmlFor='roles'
								className='w-[120px] text-center'>
								Role:{" "}
							</label>

							<select
								name='roles'
								id='roles'
								value={roles}
								onChange={(e) => setRoles(e.target.value)}
								className='px-3 py-2 bg-[#f5f5f5]	w-[300px] rounded-xl'
								required>
								<option value='admin'>Admin</option>
								<option value='emp'>Employee</option>
							</select>
						</div>
					</form>
				</div>
				<div className='flex justify-end items-center gap-3 pt-2'>
					<Button name='Cancel' onClick={handleCancel} />
					<Button name='Save' type='submit' form='editUserForm' />
				</div>
			</div>
		</div>
	);
};

export default EditUser;
