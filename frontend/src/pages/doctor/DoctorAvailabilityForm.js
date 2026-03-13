import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import AlertDialog from "../../components/SuccessAlert";
import LoadingSpinner from "../../components/Loading";
import {
  MenuItem,
  Select,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  Container,
  FormControl,
  InputLabel,
  Paper,
  Chip,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import MainLayout from "../../layouts/MainLayout";
import {
  fetchMyAvailability,
  addAvailability,
  deleteAvailability,
} from "../../api/availability";

const dayLabels = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

export default function DoctorAvailabilityForm() {
  const [dayOfWeek, setDayOfWeek] = useState("MONDAY");
  const [startTime, setStartTime] = useState(dayjs().hour(9).minute(0));
  const [endTime, setEndTime] = useState(dayjs().hour(12).minute(0));
  const [availabilities, setAvailabilities] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const days = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const data = await fetchMyAvailability();
        setAvailabilities(data);
      } catch (err) {
        setErrorMessage("Failed to load availability.");
        setErrorOpen(true);
      } finally {
        setLoading(false);
      }
    };

    loadAvailability();
  }, []);

  const handleSubmit = async () => {
    if (!startTime || !endTime) {
      setErrorMessage("Please select both start and end time.");
      setErrorOpen(true);
      return;
    }

    if (endTime.isBefore(startTime) || endTime.isSame(startTime)) {
      setErrorMessage("End time must be later than start time.");
      setErrorOpen(true);
      return;
    }

    const duplicateExists = availabilities.some(
      (a) =>
        a.dayOfWeek === dayOfWeek &&
        a.startTime === startTime.format("HH:mm") &&
        a.endTime === endTime.format("HH:mm")
    );

    if (duplicateExists) {
      setErrorMessage("This availability slot already exists.");
      setErrorOpen(true);
      return;
    }

    const newAvailability = {
      dayOfWeek,
      startTime: startTime.format("HH:mm"),
      endTime: endTime.format("HH:mm"),
    };

    try {
      const saved = await addAvailability(newAvailability);
      setAvailabilities((prev) => [...prev, saved]);
      setAlertOpen(true);
    } catch (err) {
      setErrorMessage("Failed to save availability.");
      setErrorOpen(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAvailability(id);
      setAvailabilities((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setErrorMessage("Failed to delete availability.");
      setErrorOpen(true);
    }
  };

  const sortedAvailabilities = [...availabilities].sort((a, b) => {
    const dayOrder = days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek);
    if (dayOrder !== 0) return dayOrder;
    return a.startTime.localeCompare(b.startTime);
  });

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
        title="Availability Saved"
        message="Your availability has been added successfully."
        onClose={() => setAlertOpen(false)}
      />

      <AlertDialog
        open={errorOpen}
        title="Error"
        message={errorMessage}
        onClose={() => setErrorOpen(false)}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          sx={{
            minHeight: "100vh",
            background:
              "linear-gradient(180deg, #f8fbff 0%, #eef5ff 50%, #f9fafb 100%)",
            py: { xs: 6, md: 10 },
          }}
        >
          <Container maxWidth="lg">
            <Paper
              elevation={0}
              sx={{
                mb: 5,
                p: { xs: 3, md: 5 },
                borderRadius: 4,
                background: "rgba(255,255,255,0.9)",
                border: "1px solid #e5e7eb",
              }}
            >
              <Stack spacing={1}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <EventAvailableIcon sx={{ color: "#2563eb" }} />
                  <Typography variant="h4" fontWeight={700} color="text.primary">
                    Manage Availability
                  </Typography>
                </Box>

                <Typography variant="body1" color="text.secondary">
                  Add your available days and hours so patients can book appointments
                  more easily.
                </Typography>
              </Stack>
            </Paper>

            <Grid container spacing={4}>
              <Grid item xs={12} md={5}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight={700} mb={1}>
                      Add New Slot
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                      Choose a day and define the time range you want to make
                      available.
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel id="day-select-label">Day</InputLabel>
                          <Select
                            labelId="day-select-label"
                            value={dayOfWeek}
                            label="Day"
                            onChange={(e) => setDayOfWeek(e.target.value)}
                          >
                            {days.map((day) => (
                              <MenuItem key={day} value={day}>
                                {dayLabels[day]}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TimePicker
                          label="Start Time"
                          value={startTime}
                          onChange={(newValue) => setStartTime(newValue)}
                          sx={{ width: "100%" }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TimePicker
                          label="End Time"
                          value={endTime}
                          onChange={(newValue) => setEndTime(newValue)}
                          sx={{ width: "100%" }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Preview
                          </Typography>
                          <Typography variant="subtitle1" fontWeight={600} mt={0.5}>
                            {dayLabels[dayOfWeek]} • {startTime?.format("HH:mm")} -{" "}
                            {endTime?.format("HH:mm")}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          fullWidth
                          size="large"
                          onClick={handleSubmit}
                          sx={{
                            py: 1.4,
                            borderRadius: 3,
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "1rem",
                            boxShadow: "none",
                          }}
                        >
                          Save Availability
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={7}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
                    minHeight: "100%",
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          Current Availability
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Your saved weekly schedule
                        </Typography>
                      </Box>

                      <Chip
                        label={`${availabilities.length} slot${
                          availabilities.length !== 1 ? "s" : ""
                        }`}
                        color="primary"
                        variant="outlined"
                      />
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {sortedAvailabilities.length === 0 ? (
                      <Box
                        sx={{
                          py: 8,
                          textAlign: "center",
                          borderRadius: 3,
                          backgroundColor: "#f8fafc",
                          border: "1px dashed #cbd5e1",
                        }}
                      >
                        <CalendarMonthIcon
                          sx={{ fontSize: 42, color: "#94a3b8", mb: 1 }}
                        />
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          No availability yet
                        </Typography>
                        <Typography color="text.secondary">
                          Add your first available time slot using the form on the
                          left.
                        </Typography>
                      </Box>
                    ) : (
                      <Stack spacing={2.5}>
                        {sortedAvailabilities.map((a) => (
                          <Paper
                            key={a.id}
                            elevation={0}
                            sx={{
                              p: 2.5,
                              borderRadius: 3,
                              border: "1px solid #e5e7eb",
                              transition: "0.2s ease",
                              "&:hover": {
                                boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                                transform: "translateY(-1px)",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight={700}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <CalendarMonthIcon
                                    sx={{ fontSize: 18, color: "#2563eb" }}
                                  />
                                  {dayLabels[a.dayOfWeek]}
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mt: 0.5,
                                  }}
                                >
                                  <AccessTimeIcon sx={{ fontSize: 16 }} />
                                  {a.startTime} - {a.endTime}
                                </Typography>
                              </Box>

                              <IconButton
                                color="error"
                                onClick={() => handleDelete(a.id)}
                                sx={{
                                  border: "1px solid #fecaca",
                                  backgroundColor: "#fff5f5",
                                  "&:hover": {
                                    backgroundColor: "#fee2e2",
                                  },
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Paper>
                        ))}
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </LocalizationProvider>
    </MainLayout>
  );
}