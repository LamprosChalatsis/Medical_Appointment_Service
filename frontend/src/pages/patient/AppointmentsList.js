import { useEffect, useState } from "react";
import { getAppointments, cancelAppointment } from "../../api/appointments";
import LoadingSpinner from "../../components/Loading";
import AppointmentCard from "../../components/AppointmentCard";
import MainLayout from "../../layouts/MainLayout";
import AlertDialog from "../../components/SuccessAlert";
import { Grid, Typography, Container, Box } from "@mui/material";

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const data = await getAppointments();
        const normalized = data.map((a) => ({ ...a, id: a.id || a._id }));
        setAppointments(normalized);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, []);

  const handleCancel = async (appointmentId) => {
    try {
      await cancelAppointment(appointmentId);
      // Remove the cancelled appointment from the list
      setAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
      setAlertTitle("Success");
      setAlertMessage("Appointment cancelled successfully");
      setAlertOpen(true);
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      setAlertTitle("Error");
      setAlertMessage("Failed to cancel appointment");
      setAlertOpen(true);
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
      <AlertDialog
        open={alertOpen}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />

      <Box sx={{ bgcolor: "#f6f8fc", py: 8 }}>
        <Container maxWidth="lg">
          {/* Modern header box */}
          <Box
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "white",
              boxShadow: "0 6px 20px rgba(20, 30, 60, 0.06)",
              mb: 4,
            }}
          >
            <Typography variant="h4" fontWeight={800} gutterBottom>
              My Appointments
            </Typography>
            <Typography color="text.secondary">
              Review and manage your scheduled appointments.
            </Typography>
          </Box>

          {appointments.length === 0 ? (
            <Box textAlign="center" mt={6}>
              <Typography variant="h6">No appointments found</Typography>
              <Typography color="text.secondary">
                Book an appointment to see it here.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {appointments.map((appointment) => (
                <Grid item xs={12} sm={6} lg={4} key={appointment.id} sx={{ minWidth: 0 }}>
                  <AppointmentCard appointment={appointment} onCancel={handleCancel} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </MainLayout>
  );
}