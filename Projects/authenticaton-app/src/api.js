import axios from "axios";

const API = axios.create({
    baseURL: "https://api.freeapi.app/api/v1/users",
    withCredentials: true,
});

export const registerUser = (data) => API.post("/register", data);
export const loginUser = (data) => API.post("/login", data);
export const logoutUser = () => API.post("/logout");
export const getCurrentUser = () => API.get("/current-user");