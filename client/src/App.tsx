import { useEffect, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MainView from "./components/MainView";
import { Route, Routes, json } from "react-router-dom";
import api from "./api/api";
import Login from "./components/Login";
import UserRoute from "./components/user/UserRoute";
import AdminRoute from "./components/admin/AdminRoute";
import ProfileView from "./components/views/ProfileView";
import HomeView from "./components/views/HomeView";
import TaskView from "./components/views/TaskView";
import ProjectView from "./components/views/ProjectView";
import UserView from "./components/views/UserView";
import UserDashLayout from "./components/Layout/UserDashLayout";

export type User = {
	_id: string;
	name: string;
	email: string;
	empID: string;
	roles: string;
};

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userInfo, setUserInfo] = useState<User>(() => {
		if (localStorage["userInfo"]) {
			const info = JSON.parse(localStorage.getItem("userInfo") || "");
			setIsLoggedIn(true);
			return info;
		}
		return {
			name: "",
			_id: "",
			email: "",
			empID: "",
			roles: "",
		};
	});

	return (
		<div className='w-full h-screen bg-[#f8f8f8] font-sans grid grid-cols-10 grid-rows-10'>
			<Header
				isLoggedIn={isLoggedIn}
				setIsLoggedIn={setIsLoggedIn}
				userInfo={userInfo}
			/>
			<Routes>
				<Route path='/' element={<UserRoute isLoggedIn={isLoggedIn} />}>
					<Route index element={<HomeView />} />
					<Route
						path='dash'
						element={<UserDashLayout userInfo={userInfo} />}>
						<Route
							index
							element={<ProfileView userInfo={userInfo} />}
						/>
						<Route path='task' element={<TaskView />} />
						<Route path='project' element={<ProjectView />} />
					</Route>
					<Route
						path='admin'
						element={<AdminRoute userInfo={userInfo} />}>
						<Route index element={<TaskView />} />
						<Route path='project' element={<ProjectView />} />
						<Route path='user' element={<UserView />} />
					</Route>
				</Route>
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
			{/* <Sidebar userInfo={userInfo} />
			<MainView userInfo={userInfo} /> */}
		</div>
	);
}

export default App;
