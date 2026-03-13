import { api } from "./apiClient";

const ALLERGIES_URL = "/allergies";

// Fetch all allergies
export async function getAllAllergies() {
  const res = await api.get(ALLERGIES_URL);
  return res.data;
}

// Fetch patient's allergies
export async function getPatientAllergies() {
  const res = await api.get(`${ALLERGIES_URL}/patient`);
  return res.data;
}

// Add allergy to patient
export async function addAllergy(allergyid) {
  console.log("Adding allergy with ID:", allergyid);
  const res = await api.post(`${ALLERGIES_URL}/patient/${allergyid}`);
  return res.data;
}

// Remove allergy from patient
export async function removeAllergy(allergyid) {
  const res = await api.delete(`${ALLERGIES_URL}/patient/${allergyid}`);
  return res.data;
}
