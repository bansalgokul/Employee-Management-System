import { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { User } from "../types";
import Button from "../Shared/Button";
import ErrorDisplay from "../Shared/ErrorDisplay";
import { isAxiosError } from "axios";

type Props = {
	setUserInfo: React.Dispatch<React.SetStateAction<User>>;
	setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const Login = ({ setUserInfo, setIsLoggedIn }: Props) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const response = await api.post(
				"/auth/login",
				{
					email,
					password,
				},
				{ withCredentials: true },
			);

			if (response.status === 200) {
				// Setting access token
				api.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;
				setUserInfo(response.data.userDoc);
				setIsLoggedIn(true);
				localStorage.setItem(
					"userInfo",
					JSON.stringify(response.data.userDoc),
				);
				localStorage.setItem(
					"accessToken",
					JSON.stringify(response.data.accessToken),
				);

				navigate("/");
			}
		} catch (err) {
			if (isAxiosError(err)) {
				setError(err?.response?.data?.error);
			}
			console.log(err);
		}
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
						id='loginForm'
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

						{/* Error display is not complete but functioning for this component */}
						{error && <ErrorDisplay error={error} />}
						<Button name='Login' type='submit' form='loginForm' />
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
