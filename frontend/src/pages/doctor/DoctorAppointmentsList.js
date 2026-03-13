import { useEffect, useState } from "react";
import {
  getAppointments,
  cancelAppointmentByDoctor,
  confirmAppointment,
} from "../../api/appointments";
import LoadingSpinner from "../../components/Loading";
import MainLayout from "../../layouts/MainLayout";
import AlertDialog from "../../components/SuccessAlert";

export default function DoctorAppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAppointments();
        const normalized = data
          .map((a) => ({
            ...a,
            id: a.id || a._id,
          }))
          .sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA - dateB;
          });

        setAppointments(normalized);
      } catch (error) {
        setAlertTitle("Error");
        setAlertMessage("Failed to load appointments");
        setAlertOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateStatus = (appointmentId, newStatus) => {
    const updated = appointments.map((a) =>
      a.id === appointmentId ? { ...a, status: newStatus } : a
    );
    setAppointments(updated);
  };

  const handleAccept = async (appointmentId) => {
    try {
      await confirmAppointment(appointmentId);
      updateStatus(appointmentId, "CONFIRMED");

      setAlertTitle("Success");
      setAlertMessage("Appointment confirmed successfully.");
      setAlertOpen(true);
    } catch {
      setAlertTitle("Error");
      setAlertMessage("Failed to confirm appointment.");
      setAlertOpen(true);
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      await cancelAppointmentByDoctor(appointmentId);
      updateStatus(appointmentId, "CANCELLED");

      setAlertTitle("Cancelled");
      setAlertMessage("Appointment cancelled successfully.");
      setAlertOpen(true);
    } catch {
      setAlertTitle("Error");
      setAlertMessage("Failed to cancel appointment.");
      setAlertOpen(true);
    }
  };

  const statusStyles = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    COMPLETED: "bg-blue-100 text-blue-700",
  };

  const upcomingAppointments = appointments.filter(
    (a) => a.status === "PENDING" || a.status === "CONFIRMED"
  );

  const completedAppointments = appointments.filter(
    (a) => a.status === "COMPLETED"
  );

  const cancelledAppointments = appointments.filter(
    (a) => a.status === "CANCELLED"
  );

  const renderAppointments = (list) => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((appointment) => (
        <div
          key={appointment.id}
          className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-slate-100"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-lg font-semibold text-slate-800">
                {appointment.date}
              </p>
              <p className="text-slate-500 text-sm">{appointment.time}</p>
            </div>

            <span
              className={`text-xs font-medium px-3 py-1 rounded-full ${
                statusStyles[appointment.status] ||
                "bg-gray-100 text-gray-600"
              }`}
            >
              {appointment.status}
            </span>
          </div>

          <div className="mt-4">
            <p className="text-sm text-slate-600">
              Patient:
              <span className="font-medium text-slate-800 ml-1">
                {appointment.patientName}
              </span>
            </p>
          </div>

          {appointment.status === "PENDING" && (
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleAccept(appointment.id)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-xl transition"
              >
                Confirm
              </button>

              <button
                onClick={() => handleCancel(appointment.id)}
                className="flex-1 border border-red-500 text-red-600 hover:bg-red-50 text-sm font-medium py-2 rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <AlertDialog
        open={alertOpen}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />

      <div className="bg-slate-50 min-h-screen pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-800">
              My Appointments
            </h1>
            <p className="text-slate-500 mt-2">
              Manage and review your patient bookings.
            </p>
          </div>

          {appointments.length === 0 ? (
            <div className="text-center mt-20 text-slate-500">
              No appointments found.
            </div>
          ) : (
            <>
              {upcomingAppointments.length > 0 && (
                <>
                  <h2 className="text-xl font-semibold text-slate-700 mb-4">
                    Upcoming Appointments
                  </h2>
                  {renderAppointments(upcomingAppointments)}
                </>
              )}

              {completedAppointments.length > 0 && (
                <>
                  <h2 className="text-xl font-semibold text-slate-700 mt-12 mb-4">
                    Completed Appointments
                  </h2>
                  {renderAppointments(completedAppointments)}
                </>
              )}

              {cancelledAppointments.length > 0 && (
                <>
                  <h2 className="text-xl font-semibold text-slate-700 mt-12 mb-4">
                    Cancelled Appointments
                  </h2>
                  {renderAppointments(cancelledAppointments)}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}