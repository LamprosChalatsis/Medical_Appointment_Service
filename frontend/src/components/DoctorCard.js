import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  MenuItem,
  Select,
  Box,
  Stack,
  Chip,
  Avatar,
  Collapse,
  Divider,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import AlertDialog from "./SuccessAlert";
import { fetchSlots } from "../api/availability";
import { createAppointment } from "../api/appointments";

export default function DoctorCard({ doctor }) {
  const [date, setDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [openBooking, setOpenBooking] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleDateChange = async (newDate) => {
    setDate(newDate);
    setSelectedSlot("");
    setSlots([]);

    if (!newDate) return;

    try {
      const formatted = dayjs(newDate).format("YYYY-MM-DD");
      const data = await fetchSlots(doctor.id, formatted);
      setSlots(data);
    } catch (err) {
      console.error("Failed to fetch slots", err);
    }
  };

  const handleBook = async () => {
    if (!date || !selectedSlot) {
      setAlertTitle("Missing info");
      setAlertMessage("Please select date and time");
      setAlertOpen(true);
      return;
    }

    const appointment = {
      doctorId: doctor.id,
      date: dayjs(date).format("YYYY-MM-DD"),
      time: selectedSlot,
    };

    try {
      await createAppointment(appointment);
      setAlertTitle("Appointment booked");
      setAlertMessage(
        `Booked with Dr. ${doctor.username} on ${dayjs(date).format(
          "DD MMM YYYY"
        )} at ${selectedSlot}`
      );
      setAlertOpen(true);

      // reset booking UI after success (no page reload)
      setOpenBooking(false);
      setDate(null);
      setSlots([]);
      setSelectedSlot("");
    } catch (err) {
      setAlertTitle("Error");
      setAlertMessage("Failed to book appointment");
      setAlertOpen(true);
    }
  };

  return (
    <>
      <AlertDialog
        open={alertOpen}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />

      <Card
        sx={{
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 8px 24px rgba(20,30,60,0.06)",
        }}
      >
        <CardContent>
          {/* Top row */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 48, height: 48 }}>
              {doctor.username?.[0]?.toUpperCase() || "D"}
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={800} lineHeight={1.1}>
                Dr. {doctor.username}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                <PlaceIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {doctor.location || "Unknown location"}
                </Typography>
              </Stack>
            </Box>

            {/* Optional: rating chip (static if you don’t have rating yet) */}
            <Chip label="4.8 ★" size="small" />
          </Stack>

          {/* Specialties */}
          <Stack direction="row" spacing={1} mt={2} flexWrap="wrap" useFlexGap>
            {(doctor.specialties || []).slice(0, 3).map((s) => (
              <Chip key={s.id || s.name} label={s.name} size="small" variant="outlined" />
            ))}
            {(doctor.specialties || []).length === 0 && (
              <Chip label="General" size="small" variant="outlined" />
            )}
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Actions */}
          <Button
            variant={openBooking ? "outlined" : "contained"}
            fullWidth
            startIcon={<EventAvailableIcon />}
            onClick={() => setOpenBooking((p) => !p)}
            sx={{ borderRadius: 3, py: 1.2, fontWeight: 700 }}
          >
            {openBooking ? "Hide booking" : "Book appointment"}
          </Button>

          {/* Booking UI collapsible */}
          <Collapse in={openBooking} timeout={200} unmountOnExit>
            <Box sx={{ mt: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select Date"
                  value={date}
                  onChange={handleDateChange}
                  disablePast
                  sx={{ width: "100%", mb: 2 }}
                />
              </LocalizationProvider>

              {date && (
                <>
                  {slots.length > 0 ? (
                    <Select
                      fullWidth
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      sx={{ mb: 2 }}
                    >
                      {slots.map((slot, i) => (
                        <MenuItem key={i} value={slot.startTime}>
                          {slot.startTime} - {slot.endTime}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <Typography color="text.secondary" mb={2}>
                      No slots available for this date
                    </Typography>
                  )}

                  <Button
                    variant="contained"
                    fullWidth
                    disabled={!selectedSlot}
                    onClick={handleBook}
                    sx={{ borderRadius: 3, py: 1.2, fontWeight: 700 }}
                  >
                    Confirm booking
                  </Button>
                </>
              )}
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </>
  );
}