import { useEffect, useState } from "react";
import Header from "./components/Shared/Header";
import { Route, Routes } from "react-router-dom";
import api from "./api/api";
import Login from "./components/Shared/Login";
import UserRoute from "./components/user/UserRoute";
import { User } from "./components/types";
import Loading from "./components/Shared/Loading";

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

	const refreshAccessToken = async () => {
		try {
			const response = await api.get("/auth/refresh", {
				withCredentials: true,
			});

			if (response.status === 200) {
				const newAccessToken = response.data.accessToken;
				api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
				localStorage.setItem(
					"accessToken",
					JSON.stringify(newAccessToken),
				);
			}
		} catch (err) {
			console.error("Error refreshing access token:", err);
			localStorage.clear();
			setIsLoggedIn(false);
		}
	};

	useEffect(() => {
		setLoading(true);

		refreshAccessToken();

		const refreshInterval = setInterval(refreshAccessToken, 10 * 60 * 1000);

		if (localStorage["userInfo"]) {
			const info = JSON.parse(localStorage.getItem("userInfo") || "");
			setIsLoggedIn(true);
			setUserInfo(info);
		}

		setLoading(false);

		return () => clearInterval(refreshInterval);
	}, []);

	return (
		<div className='w-full h-screen bg-[#f8f8f8] font-sans grid grid-cols-10 grid-rows-10'>
			{loading ? (
				<Loading />
			) : (
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
