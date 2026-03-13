import { Routes, Route } from "react-router-dom";
import Login from "../pages/public/LogIn";
import Register from "../pages/public/Register";
import AppointmentsList from "../pages/patient/AppointmentsList";
import UserList from "../pages/admin/UserList";
import DoctorAvailabilityForm from "../pages/doctor/DoctorAvailabilityForm";
import DoctorAppointmentsList from "../pages/doctor/DoctorAppointmentsList";
import DoctorList from "../pages/patient/DoctorList";
import Home from "../pages/public/Home";
import PatientDashboard from "../pages/dashboard/PatientDashboard";
import DoctorDashboard from "../pages/dashboard/DoctorDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import AdminAppointments from "../pages/admin/AdminAppointments";
import ProtectedRoute from "./ProtectedRoutes";
import Settings from "../pages/settings/SettingsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/appointments"
        element={
          <ProtectedRoute allowedRoles={["ROLE_PATIENT"]}>
            <AppointmentsList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <UserList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/availability"
        element={
          <ProtectedRoute allowedRoles={["ROLE_DOCTOR"]}>
            <DoctorAvailabilityForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor-appointments"
        element={
          <ProtectedRoute allowedRoles={["ROLE_DOCTOR"]}>
            <DoctorAppointmentsList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctors"
        element={
          <ProtectedRoute allowedRoles={["ROLE_PATIENT"]}>
            <DoctorList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/patient"
        element={
          <ProtectedRoute allowedRoles={["ROLE_PATIENT"]}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/doctor"
        element={
          <ProtectedRoute allowedRoles={["ROLE_DOCTOR"]}>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/appointments"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <AdminAppointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={["ROLE_PATIENT", "ROLE_DOCTOR", "ROLE_ADMIN"]}>
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}