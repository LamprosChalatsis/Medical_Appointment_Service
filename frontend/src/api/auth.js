import { api } from "./apiClient";
import { clearAuthStorage, saveAuthSession } from "../utils/auth";

export const Login = async (username, password) => {
  try {
    const res = await api.post("/auth/signin", { username, password });
    saveAuthSession(res.data);
    return res.data;
  } catch (err) {
    const data = err.response?.data;
    throw new Error(data?.message || data?.error || "Login failed");
  }
};

export const Logout = () => {
  clearAuthStorage();
  window.location.href = "/";
};

export const registerUser = async (data) => {
  try {
    const res = await api.post("/auth/signup", data);
    return res.data;
  } catch (err) {
    const data = err.response?.data;
    throw new Error(data?.message || data?.error || "Registration failed");
  }
};  