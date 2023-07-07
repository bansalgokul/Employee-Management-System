import { useEffect, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/user/UserSidebar";
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
import UserDashLayout from "./components/user/UserDashLayout";

export type User = {
	_id: string;
	name: string;
	email: string;
	empID: string;
	roles: string;
};

export type Project = {
	_id: string;
	title: string;
	description: string;
	completed: boolean;
	assigned: Array<object>;
};

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [loading, setLoading] = useState(true);

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

	const [projectList, setProjectList] = useState<Project[]>([]);

	useEffect(() => {
		setLoading(true);

		function fetchToken() {
			if (localStorage["accessToken"]) {
				const token = JSON.parse(
					localStorage.getItem("accessToken") || "",
				);
				console.log(`Bearer ${token}`);
				api.defaults.headers.common.Authorization = `Bearer ${token}`;
			}
		}
		fetchToken();

		async function getProjects() {
			try {
				const url = "/project";
				const response = await api.get(url);
				if (response.status === 200) {
					setProjectList(response.data.projectDocs);
					console.log(response.data);
					setLoading(false);
				}
			} catch (error) {
				console.log("Error fetching Projects:", error);
			}
		}

		getProjects();
	}, []);

	return (
		<div className='w-full h-screen bg-[#f8f8f8] font-sans grid grid-cols-10 grid-rows-10'>
			<Header
				isLoggedIn={isLoggedIn}
				setIsLoggedIn={setIsLoggedIn}
				userInfo={userInfo}
			/>
			<Routes>
				{!loading && (
					<Route
						path='/'
						element={<UserRoute isLoggedIn={isLoggedIn} />}>
						<Route
							index
							element={<HomeView projectList={projectList} />}
						/>
						<Route
							path='dash'
							element={<UserDashLayout userInfo={userInfo} />}>
							<Route
								index
								element={<ProfileView userInfo={userInfo} />}
							/>
							<Route
								path='task'
								element={<TaskView isAdminView={false} />}
							/>
							<Route
								path='project'
								element={<ProjectView isAdminView={false} />}
							/>
						</Route>
						<Route
							path='admin'
							element={<AdminRoute userInfo={userInfo} />}>
							<Route
								index
								element={<TaskView isAdminView={true} />}
							/>
							<Route
								path='project'
								element={<ProjectView isAdminView={true} />}
							/>
							<Route path='user' element={<UserView />} />
						</Route>
					</Route>
				)}
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
		</div>
	);
}

export default App;
