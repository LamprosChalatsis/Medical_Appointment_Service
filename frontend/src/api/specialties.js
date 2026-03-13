import { api } from "./apiClient";

const SPECIALTIES_URL = "/specialties";

export const fetchSpecialties = async () => {
  const response = await api.get(SPECIALTIES_URL);
  return response.data;
};

export const createSpecialty = async (name) => {
  try {
    await api.post(`${SPECIALTIES_URL}/new`, { name });
    return true;
  } catch (err) {
    if (err.response?.status === 409) {
      console.log("Specialty already exists");
      return false;
    }
    throw err;
  }
};

export async function getAllSpecialties() {
  const res = await api.get(SPECIALTIES_URL);
  return res.data;
}

export async function getDoctorSpecialties() {
  const res = await api.get(`${SPECIALTIES_URL}/doctor`);
  return res.data;
}

export async function addSpecialty(id) {
  return api.post(`${SPECIALTIES_URL}/doctor/${id}`);
}

export async function removeSpecialty(id) {
  return api.delete(`${SPECIALTIES_URL}/doctor/${id}`);
}