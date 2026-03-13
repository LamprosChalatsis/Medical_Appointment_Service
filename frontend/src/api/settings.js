import { api } from "./apiClient";

const SETTING_URL = "/users/profile";
/* Get current user profile */
export const getProfile = async () => {
  const res = await api.get(`${SETTING_URL}`);
  return res.data;
};

/* Update profile */
export const updateProfile = async (profileData) => {
  const res = await api.put(`${SETTING_URL}`, profileData);
  return res.data;
};