import { useEffect, useState } from "react";
import Header from "./components/Shared/Header";
import { Route, Routes } from "react-router-dom";
import api from "./api/api";
import Login from "./components/auth/Login";
import UserRoute from "./components/user/UserRoute";
import { User } from "./components/types";
import Loading from "./components/Shared/Loading";

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [loading, setLoading] = useState(true);

	const [userInfo, setUserInfo] = useState<User>({
		_id: "",
		email: "",
		empID: "",
		name: "",
		roles: "",
	});

	// Fetch user info with every refresh
	const getProfle = async () => {
		try {
			const profileResponse = await api.get("/user");
			if (profileResponse.status === 200) {
				const userInfo = profileResponse.data.user;
				localStorage.setItem("userInfo", JSON.stringify(userInfo));
				setIsLoggedIn(true);
				setUserInfo(userInfo);
			}
		} catch (err) {
			console.log(err);
			setIsLoggedIn(false);
			// setUserInfo(null);
		} finally {
			setLoading(false);
		}
	};

	// Checking If user is already logged in .
	useEffect(() => {
		setLoading(true);

		if (localStorage["accessToken"]) {
			const token = JSON.parse(localStorage.getItem("accessToken") || "");
			api.defaults.headers.common.Authorization = `Bearer ${token}`;
		}

		getProfle();
	}, []);

	return (
		<div className='w-full h-screen bg-[#f8f8f8] font-sans grid grid-cols-15 grid-rows-15'>
			{loading ? (
				<Loading />
			) : (
				<>
					<Header
						isLoggedIn={isLoggedIn}
						setIsLoggedIn={setIsLoggedIn}
						userInfo={userInfo}
					/>
					{/*Home route with all main functionalities */}
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
						{/* Login Route */}
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
