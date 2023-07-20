import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:5000/",
	timeout: 1000,
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
	}
};

api.interceptors.response.use(
	(response) => response,
    async (error) => {
        const originalRequest = error.config;
		if (error.response.status === 401) {
			if (!originalRequest._retry) {
				originalRequest._retry = true;
				await refreshAccessToken();
				
				// Update the request so that it will get call with new header
				originalRequest.headers.Authorization = api.defaults.headers.common.Authorization;
				return api(originalRequest);
			}
        }

        return Promise.reject(error);
    }
);

export default api;
