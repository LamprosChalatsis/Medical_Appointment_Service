import { api } from "./apiClient";

const USERS_URL = "/users";

export const fetchUsers = async () => {
  const response = await api.get(USERS_URL);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`${USERS_URL}/${userId}`);
  return response.data;
};

export const approveUser = async (userId) => {
  const response = await api.patch(`${USERS_URL}/${userId}/approve`);
  return response.data;
};

export const updateUser = async (userId, data) => {
  const response = await api.put(`${USERS_URL}/${userId}`, data);
  return response.data;
};

