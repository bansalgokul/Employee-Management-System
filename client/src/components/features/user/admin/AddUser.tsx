import { useState } from "react";
import api from "../../../../api/api";
import { GrClose } from "react-icons/gr";
import { User } from "../../../types";
import Button from "../../../Shared/Button";

type Props = {
	userList: User[];
	setUserList: React.Dispatch<React.SetStateAction<User[]>>;
	setIsNewUserOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddUser = ({ userList, setUserList, setIsNewUserOpen }: Props) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [empID, setEmpID] = useState("");
	const [roles, setRoles] = useState("emp");

	const handleCancel = () => {
		setIsNewUserOpen(false);
	};

	const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const newUser = {
			name,
			email,
			password,
			empID: `EMP-${empID}`,
			roles,
		};

		const response = await api.post("/register", newUser);
		if (response.status === 201) {
			setUserList([...userList, response.data.userDoc]);
		}

		setIsNewUserOpen(false);
	};

	return (
		<div
			onClick={handleCancel}
			className='z-30 top-0 left-0 bg-[#f5f5f5] bg-opacity-50 fixed w-full h-full grid place-content-center'>
			<div
				onClick={(e) => e.stopPropagation()}
				className='border-2 p-4 rounded-md bg-white w-[500px] h-[400px] flex flex-col justify-between'>
				<div className=' flex text-xl font-semibold justify-between  items-center'>
					<div className='px-3 pb-2'>ADD USER</div>
					<div
						onClick={handleCancel}
						className='hover:cursor-pointer px-3 pb-2'>
						<GrClose />
					</div>
				</div>
				<div className='grow py-2 border-y-2'>
					<form
						id='newUserForm'
						className='w-full flex flex-col gap-2 relative'
						onSubmit={(e) => handleSave(e)}>
						<div className='flex items-center '>
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
								placeholder='Name'
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
								placeholder='Email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className='px-3 py-2 bg-[#f5f5f5]	w-[300px] rounded-xl'
								required
							/>
						</div>
						<div className='flex items-center'>
							<label
								htmlFor='password'
								className='w-[120px] text-center'>
								Password:{" "}
							</label>
							<input
								type='password'
								value={password}
								name='password'
								placeholder='Password'
								id='password'
								onChange={(e) => setPassword(e.target.value)}
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
							<div className='px-3 py-2 bg-[#f5f5f5] w-[50px] rounded-l-xl'>
								EMP-
							</div>
							<input
								type='text'
								name='empID'
								placeholder='ID'
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
								className='px-3 py-3 bg-[#f5f5f5]	w-[300px] rounded-xl'
								required>
								<option value='admin'>Admin</option>
								<option value='emp'>Employee</option>
							</select>
						</div>
						<div className='absolute bottom-4 right-4 flex gap-2'></div>
					</form>
				</div>
				<div className='flex justify-end items-center gap-3 pt-2'>
					<Button name='Cancel' onClick={handleCancel} />
					<Button name='Save' type='submit' form='newUserForm' />
				</div>
			</div>
		</div>
	);
};

export default AddUser;
