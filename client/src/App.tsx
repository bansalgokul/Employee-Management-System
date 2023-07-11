import { useEffect, useState } from "react";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import api from "./api/api";
import Login from "./components/Login";
import UserRoute from "./components/user/UserRoute";

export type User = {
	_id: string;
	name: string;
	email: string;
	empID: string;
	roles: string;
};

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [loading, setLoading] = useState(true);

	const [userInfo, setUserInfo] = useState<User>({
		_id: "",
		name: "",
		email: "",
		empID: "",
		roles: "",
	});

	useEffect(() => {
		setLoading(true);

		if (localStorage["accessToken"]) {
			const token = JSON.parse(localStorage.getItem("accessToken") || "");
			api.defaults.headers.common.Authorization = `Bearer ${token}`;
		}

		if (localStorage["userInfo"]) {
			const info = JSON.parse(localStorage.getItem("userInfo") || "");
			setIsLoggedIn(true);
			setUserInfo(info);
		}

		setLoading(false);
	}, []);

	return (
		<div className='w-full h-screen bg-[#f8f8f8] font-sans grid grid-cols-10 grid-rows-10'>
			{!loading && (
				<>
					<Header
						isLoggedIn={isLoggedIn}
						setIsLoggedIn={setIsLoggedIn}
						userInfo={userInfo}
					/>
					<Routes>
						<Route
							path='/*'
							element={
								<UserRoute
									isLoggedIn={isLoggedIn}
									userInfo={userInfo}
								/>
							}
						/>
						<Route
							path='/login'
							element={
								<Login
									setIsLoggedIn={setIsLoggedIn}
									setUserInfo={setUserInfo}
								/>
							}
						/>
					</Routes>
				</>
			)}
		</div>
	);
}

export default App;
