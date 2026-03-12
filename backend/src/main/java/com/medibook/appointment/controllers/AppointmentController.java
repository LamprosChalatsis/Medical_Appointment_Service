package com.medibook.appointment.controllers;

import com.medibook.appointment.dto.AppointmentRequestDTO;
import com.medibook.appointment.dto.AppointmentResponseDTO;
import com.medibook.appointment.service.AppointmentService;
import com.medibook.appointment.service.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {
    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AppointmentResponseDTO>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAppointments());
    }

    @GetMapping("/my")
    public ResponseEntity<List<AppointmentResponseDTO>> getMyAppointments(Authentication authentication) {
        String email = ((UserDetailsImpl) authentication.getPrincipal()).getEmail();
        return ResponseEntity.ok(appointmentService.getMyAppointments(email));
    }

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<AppointmentResponseDTO> createAppointment(
            @Valid @RequestBody AppointmentRequestDTO dto,
            Authentication authentication
    ) {
        String email = ((UserDetailsImpl) authentication.getPrincipal()).getEmail();
        AppointmentResponseDTO created = appointmentService.bookAppointment(dto, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{appointmentId}")
    public ResponseEntity<AppointmentResponseDTO> getAppointment(@PathVariable Long appointmentId) {
        return appointmentService.getAppointmentById(appointmentId)
                .map(appointmentService::getAppointmentResponseDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{appointmentId}")
    public ResponseEntity<Map<String, String>> updateAppointment(
            @PathVariable Long appointmentId,
            @Valid @RequestBody AppointmentRequestDTO dto
    ) {
        appointmentService.updateAppointment(appointmentId, dto);
        return ResponseEntity.ok(Map.of("message", "Appointment updated successfully!"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{appointmentId}")
    public ResponseEntity<Map<String, String>> deleteAppointment(@PathVariable Long appointmentId) {
        appointmentService.deleteAppointmentById(appointmentId);
        return ResponseEntity.ok(Map.of("message", "Appointment deleted successfully!"));
    }

    @PatchMapping("/cancel/{appointmentId}")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<String> cancelAppointment(
            @PathVariable Long appointmentId,
            Authentication authentication
    ) {
        String email = ((UserDetailsImpl) authentication.getPrincipal()).getEmail();
        appointmentService.cancelAppointment(appointmentId, email);
        return ResponseEntity.ok("Appointment cancelled.");
    }

    @PatchMapping("/confirm/{appointmentId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<String> confirmAppointment(
            @PathVariable Long appointmentId,
            Authentication authentication
    ) {
        String email = ((UserDetailsImpl) authentication.getPrincipal()).getEmail();
        appointmentService.confirmAppointment(appointmentId, email);
        return ResponseEntity.ok("Appointment confirmed.");
    }

    @GetMapping("/doctor/{doctorId}")
    public List<AppointmentResponseDTO> getAllAppointments(
            @PathVariable Long doctorId,
            @RequestParam String date
    ) {
        LocalDate parsedDate = LocalDate.parse(date.trim());
        return appointmentService.getAppointmentsForDoctorOnDate(doctorId, parsedDate);
    }
}