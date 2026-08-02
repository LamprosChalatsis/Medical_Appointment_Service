import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import StatCard from "../../components/dashboard/StatCard";
import QuickActionCard from "../../components/dashboard/QuickActionCard";
import ActivityList from "../../components/dashboard/ActivityList";
import { getPatientDashboardStats } from "../../api/dashboard";
import { getAppointments } from "../../api/appointments";
import LoadingSpinner from "../../components/Loading";


export default function PatientDashboard() {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const statsData = await getPatientDashboardStats();
      const appointmentsData = await getAppointments();

      setStats(statsData);
      setAppointments(appointmentsData);

      // Find next upcoming confirmed appointment
      const upcoming = appointmentsData
        .filter(a => new Date(a.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      if (upcoming.length > 0) {
        setNextAppointment(upcoming[0]);
      }

    } catch (error) {
      console.error("Failed to load patient dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner />
      </MainLayout> 
    );
  }

  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-screen pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-6 h-full flex flex-col">

          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Patient Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your appointments and stay on track.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-10">

            {/* NEXT APPOINTMENT */}
            {nextAppointment && (
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 shadow-md">
                <p className="text-sm opacity-80">
                  Your Next Appointment
                </p>

                <div className="mt-2 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Dr. {nextAppointment.doctorName}
                    </h2>
                    <p className="text-sm opacity-90">
                      {nextAppointment.date} at {nextAppointment.time}
                    </p>
                  </div>

                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs">
                    {nextAppointment.status}
                  </span>
                </div>
              </div>
            )}

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Upcoming"
                value={stats?.upcomingAppointments || 0}
                icon="📅"
                color="bg-blue-100"
              />
              <StatCard
                title="Completed"
                value={stats?.completedAppointments || 0}
                icon="✅"
                color="bg-emerald-100"
              />
              <StatCard
                title="Pending"
                value={stats?.pendingAppointments || 0}
                icon="⏳"
                color="bg-yellow-100"
              />
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <QuickActionCard
                title="Book Appointment"
                description="Find a doctor and schedule a visit"
                icon="➕"
                to="/doctors"
              />
              <QuickActionCard
                title="My Appointments"
                description="View and manage your appointments"
                icon="📋"
                to="/appointments"
              />
            </div>

            {/* RECENT ACTIVITY */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold mb-4">
                Recent Activity
              </h2>
              
              <ActivityList
                items={appointments.slice(0, 5).map( // Show only the 5 most recent appointments
                  a => `Appointment ${a.status.toLowerCase()} for ${a.date}` 
                )}
              />
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}