import { useEffect, useMemo, useState } from "react";
import { getDoctorsFull } from "../../api/doctors";
import LoadingSpinner from "../../components/Loading";
import DoctorCard from "../../components/DoctorCard";
import MainLayout from "../../layouts/MainLayout";
import {
  Grid,
  Typography,
  Container,
  TextField,
  Box,
  Divider,
  InputAdornment,
  Chip,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedDoctors, setExpandedDoctors] = useState({});

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const data = await getDoctorsFull();
        console.log("Fetched doctors:", data);

        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) =>
      (doc.username || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [search, doctors]);

  const toggleExpanded = (doctorId) => {
    setExpandedDoctors((prev) => ({
      ...prev,
      [doctorId]: !prev[doctorId],
    }));
  };

  const getSpecialties = (doctor) => {
    if (Array.isArray(doctor.specialties)) {
      return doctor.specialties
        .map((item) => {
          if (typeof item === "string") return item;
          if (item?.name) return item.name;
          if (item?.specialty_name) return item.specialty_name;
          return null;
        })
        .filter(Boolean);
    }

    if (Array.isArray(doctor.speciality)) {
      return doctor.speciality
        .map((item) => {
          if (typeof item === "string") return item;
          if (item?.name) return item.name;
          return null;
        })
        .filter(Boolean);
    }

    if (typeof doctor.specialty === "string" && doctor.specialty.trim()) {
      return [doctor.specialty];
    }

    if (typeof doctor.speciality === "string" && doctor.speciality.trim()) {
      return [doctor.speciality];
    }

    return [];
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
      <Box sx={{ bgcolor: "#f6f8fc", py: 8 }}>
        <Container maxWidth="lg">
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
              Find a Doctor
            </Typography>
            <Typography color="text.secondary" mb={3}>
              Browse verified doctors and book an appointment in minutes.
            </Typography>

            <TextField
              fullWidth
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip label={`${filteredDoctors.length} results`} />
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {filteredDoctors.length === 0 ? (
            <Box textAlign="center" mt={6}>
              <Typography variant="h6">No doctors found</Typography>
              <Typography color="text.secondary">
                Try a different search.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredDoctors.map((doctor) => {
                const specialties = getSpecialties(doctor);
                const isExpanded = expandedDoctors[doctor.id];
                const visibleSpecialties = isExpanded
                  ? specialties
                  : specialties.slice(0, 3);
                const hasMore = specialties.length > 3;

                return (
                  <Grid item xs={12} sm={6} lg={4} key={doctor.id}>
                    <Box
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        p: 2,
                        borderRadius: 4,
                        bgcolor: "white",
                        border: "1px solid",
                        borderColor: "divider",
                        boxShadow: "0 6px 20px rgba(20, 30, 60, 0.06)",
                      }}
                    >
                      <DoctorCard doctor={doctor} />

                      <Box sx={{ mt: 2 }}>
                        <Typography
                          variant="subtitle2"
                          fontWeight={700}
                          sx={{ mb: 1 }}
                        >
                          Specialties
                        </Typography>

                        {specialties.length === 0 ? (
                          <Typography variant="body2" color="text.secondary">
                            No specialties available
                          </Typography>
                        ) : (
                          <>
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1,
                              }}
                            >
                              {visibleSpecialties.map((specialty, index) => (
                                <Chip
                                  key={`${doctor.id}-${specialty}-${index}`}
                                  label={specialty}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              ))}
                            </Box>

                            {hasMore && (
                              <Button
                                size="small"
                                sx={{ mt: 1, px: 0, minWidth: "auto" }}
                                onClick={() => toggleExpanded(doctor.id)}
                              >
                                {isExpanded ? "Show less" : "View all"}
                              </Button>
                            )}
                          </>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>
      </Box>
    </MainLayout>
  );
}