import axios from "axios";
 
// Create an Axios instance with a base URL for the API
// This instance will be used for making API requests throughout the application
export const api = axios.create({
  baseURL: "/api",
});
 
 
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
 
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";
 
    const isLoginRequest = requestUrl.includes("/auth/signin");
 
    if (status === 401 && !isLoginRequest) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("roles");
      localStorage.removeItem("patientID");
      localStorage.removeItem("doctorID");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
 
      window.location.href = "/login";
    }
 
    return Promise.reject(error);
  }
);