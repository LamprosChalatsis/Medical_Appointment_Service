import MainLayout from "../../layouts/MainLayout";
import StatCard from "../../components/dashboard/StatCard";
import CalendarCard from "../../components/dashboard/CalendarCard";
import { useEffect, useState } from "react";
import { getDoctorDashboardStats } from "../../api/dashboard";
import { getAppointments } from "../../api/appointments";
import LoadingSpinner from "../../components/Loading";

export default function DoctorDashboard() {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const statsData = await getDoctorDashboardStats();
      const appointmentsData = await getAppointments();

      const normalizedAppointments = appointmentsData
        .map((a) => ({
          ...a,
          id: a.id || a._id,
        }))
        .sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateA - dateB;
        });

      setStats(statsData);
      setAppointments(normalizedAppointments);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();

  const upcomingAppointments = appointments
    .filter((a) => {
      const appointmentDateTime = new Date(`${a.date}T${a.time}`);
      const isUpcoming = appointmentDateTime >= now;
      const isRelevantStatus =
        a.status === "PENDING" || a.status === "CONFIRMED";

      return isUpcoming && isRelevantStatus;
    })
    .slice(0, 5);

  const filteredAppointments = selectedDate
    ? appointments.filter((a) => a.date === selectedDate.toISOString().split("T")[0])
    : upcomingAppointments;

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-slate-50 h-[calc(100vh-80px)] overflow-hidden pt-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900">
              Doctor Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Overview of your appointments and activity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard
              title="Total Appointments"
              value={stats?.totalAppointments || 0}
              icon="📅"
              color="bg-blue-100"
            />
            <StatCard
              title="Pending"
              value={stats?.pendingAppointments || 0}
              icon="⏳"
              color="bg-yellow-100"
            />
            <StatCard
              title="Confirmed"
              value={stats?.confirmedAppointments || 0}
              icon="✅"
              color="bg-emerald-100"
            />
            <StatCard
              title="Today"
              value={stats?.todayAppointments || 0}
              icon="📍"
              color="bg-purple-100"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100%-160px)]">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4">
                {selectedDate
                  ? `Appointments on ${selectedDate.toDateString()}`
                  : "Upcoming Appointments"}
              </h2>

              {filteredAppointments.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  {selectedDate
                    ? "No appointments for this date."
                    : "No upcoming appointments."}
                </p>
              ) : (
                <div className="space-y-4">
                  {filteredAppointments.map((a) => (
                    <div
                      key={a.id}
                      className="flex justify-between items-center border-b pb-3"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {a.patientName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {a.date} at {a.time}
                        </p>
                      </div>

                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          a.status === "CONFIRMED"
                            ? "bg-emerald-100 text-emerald-700"
                            : a.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : a.status === "COMPLETED"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {a.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <CalendarCard
                appointments={appointments}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}