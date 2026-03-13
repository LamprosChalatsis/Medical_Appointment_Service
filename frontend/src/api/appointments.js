import { api } from "./apiClient";

const APPOINTMENT_URL = "/appointment";

// Admin-only: Get all appointments
export async function getAllAppointments() {
  const res = await api.get(`${APPOINTMENT_URL}/admin/all`);
  return res.data;
}

// Fetch user's appointments
export async function getAppointments() {
  const response = await api.get(`${APPOINTMENT_URL}/my`);
  return response.data;
}

// Create appointment
export async function createAppointment(appointment) {
  const response = await api.post(APPOINTMENT_URL, appointment);
  return response.data;
}

// Fetch doctor appointments
export async function fetchDoctorAppointments(doctorId, date) {
  const response = await api.get(`${APPOINTMENT_URL}/doctor/${doctorId}`, {
    params: {
      date: date.format("YYYY-MM-DD"),
    },
  });
  return response.data;
}

// Cancel
export async function cancelAppointment(appointmentId) {
  const response = await api.patch(`${APPOINTMENT_URL}/cancel/${appointmentId}`);
  return response.data;
}

// Doctor cancels appointment
export async function cancelAppointmentByDoctor(appointmentId) {
  const response = await api.patch(`${APPOINTMENT_URL}/doctor/cancel/${appointmentId}`);
  return response.data;
}

// Confirm
export async function confirmAppointment(appointmentId) {
  const response = await api.patch(`${APPOINTMENT_URL}/confirm/${appointmentId}`);
  return response.data;
}