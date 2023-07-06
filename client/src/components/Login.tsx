import { useState } from "react";
import api from "../api/api";
import { User } from "../App";
import { useNavigate } from "react-router-dom";

type Props = {
	setUserInfo: React.Dispatch<React.SetStateAction<User>>;
	setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const Login = ({ setUserInfo, setIsLoggedIn }: Props) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const response = await api.post(
			"/auth/login",
			{
				email,
				password,
			},
			{ withCredentials: true },
		);

		if (response.status === 200) {
			api.defaults.headers.common.Authorization =
				response.data.accessToken;
			setUserInfo(response.data.userDoc);
			setIsLoggedIn(true);
			localStorage.setItem(
				"userInfo",
				JSON.stringify(response.data.userDoc),
			);

			navigate("/");
		}
		console.log(response);
	};

	return (
		<div className='col-start-1 col-end-11 row-start-2 row-end-11 grid place-content-center'>
			<div className='flex'>
				<div className='w-1/2'>
					<img
						src='https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg'
						alt=''
					/>
				</div>
				<div className='w-1/2'>
					<form
						action=''
						className='flex flex-col h-full justify-center gap-4'
						onSubmit={handleLogin}>
						<input
							type='email'
							className='border-2 py-3 px-2 rounded-md'
							placeholder='Email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<input
							type='password'
							className='border-2 py-3 px-2 rounded-md'
							placeholder='Password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>

						<button
							type='submit'
							className='w-full bg-[#3B71CA] py-3 text-white text-base font-semibold rounded-lg'>
							Login
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
