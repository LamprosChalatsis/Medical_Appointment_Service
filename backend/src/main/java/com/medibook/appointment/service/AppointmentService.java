package com.medibook.appointment.service;

import com.medibook.appointment.config.SecurityUtils;
import com.medibook.appointment.dto.AppointmentRequestDTO;
import com.medibook.appointment.dto.AppointmentResponseDTO;
import com.medibook.appointment.entities.*;
import com.medibook.appointment.mapper.AppointmentMapper;
import com.medibook.appointment.repositories.AppointmentRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentService.class);

    private final AppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;
    private final UserService userService;
    private final DoctorProfileService doctorProfileService;
    private final EmailService emailService;
    private final NotificationService notificationService;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            AppointmentMapper appointmentMapper,
            UserService userService,
            DoctorProfileService doctorProfileService,
            EmailService emailService,
            NotificationService notificationService
    ) {
        this.appointmentRepository = appointmentRepository;
        this.appointmentMapper = appointmentMapper;
        this.userService = userService;
        this.doctorProfileService = doctorProfileService;
        this.emailService = emailService;
        this.notificationService = notificationService;
    }

    @Transactional
    public AppointmentResponseDTO bookAppointment(AppointmentRequestDTO dto, String userEmail) {
        User user = userService.findUserByEmail(userEmail);

        Doctor_Profile doctor = doctorProfileService.findDoctorProfileById(dto.getDoctorId())
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        boolean exists = appointmentRepository.existsByDoctorAndDateAndTime(
                doctor,
                dto.getDate(),
                dto.getTime()
        );

        if (exists) {
            throw new IllegalStateException("This slot is already booked");
        }

        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setDoctor(doctor);
        appointment.setDate(dto.getDate());
        appointment.setTime(dto.getTime());
        appointment.setDescription(dto.getDescription());
        appointment.setStatus(AppointmentStatus.PENDING);

        logger.info("Saving appointment for patient {}", userEmail);
        Appointment savedAppointment = appointmentRepository.save(appointment);
        logger.info("Saved appointment with id {}", savedAppointment.getId());

        emailService.sendAppointmentConfirmationEmailPatient(
                userEmail,
                savedAppointment.getDate().toString(),
                savedAppointment.getTime().toString(),
                doctor.getUser().getLastName()
        );

        emailService.sendAppointmentConfirmationEmailDoctor(
                doctor.getUser().getEmail(),
                savedAppointment.getDate().toString(),
                savedAppointment.getTime().toString()
        );

        notificationService.createNotification(
                doctor.getUser(),
                "New pending appointment on "
                        + savedAppointment.getDate() + " at "
                        + savedAppointment.getTime()
                        + " from patient "
                        + user.getLastName()
        );

        return getAppointmentResponseDTO(savedAppointment);
    }

    public void updateAppointment(Long appointmentId, AppointmentRequestDTO newAppointment) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

        appointment.setDate(newAppointment.getDate());
        appointment.setDescription(newAppointment.getDescription());
        appointment.setTime(newAppointment.getTime());

        appointmentRepository.save(appointment);
    }

    public List<AppointmentResponseDTO> getAppointments() {
        return appointmentRepository.findAll().stream()
                .map(this::getAppointmentResponseDTO)
                .sorted(Comparator
                        .comparing(AppointmentResponseDTO::getDate)
                        .thenComparing(AppointmentResponseDTO::getTime))
                .toList();
    }

    public Optional<Appointment> getAppointmentById(Long appointmentId) {
        return appointmentRepository.findById(appointmentId);
    }

    public List<Appointment> getAppointmentsByPatient(User user) {
        return appointmentRepository.findByUser(user);
    }

    public List<Appointment> getAppointmentsByDoctorProfile(Doctor_Profile doctorProfile) {
        return appointmentRepository.findByDoctor(doctorProfile);
    }

    @Transactional
    public boolean deleteAppointmentById(Long appointmentId) {
        Optional<Appointment> appointmentOptional = appointmentRepository.findById(appointmentId);
        if (appointmentOptional.isEmpty()) {
            return false;
        }

        Appointment appointment = appointmentOptional.get();

        emailService.sendAppointmentCancelationEmailDoctor(
                appointment.getDoctor().getUser().getEmail(),
                appointment.getDate().toString(),
                appointment.getTime().toString()
        );
        emailService.sendAppointmentCancelationEmailPatient(
                appointment.getUser().getEmail(),
                appointment.getDate().toString(),
                appointment.getTime().toString(),
                appointment.getDoctor().getUser().getLastName()
        );

        appointmentRepository.deleteById(appointmentId);
        return true;
    }

    @Transactional
    public List<AppointmentResponseDTO> getMyAppointments(String email) {
        User user = userService.findUserByEmail(email);
        List<Appointment> result = new ArrayList<>();

        if (SecurityUtils.hasRole(user, "ROLE_PATIENT") && user.getPatientProfile() != null) {
            result.addAll(getAppointmentsByPatient(user));
        }

        if (SecurityUtils.hasRole(user, "ROLE_DOCTOR") && user.getDoctorProfile() != null) {
            result.addAll(getAppointmentsByDoctorProfile(user.getDoctorProfile()));
        }

        if (SecurityUtils.hasRole(user, "ROLE_ADMIN")) {
            result = appointmentRepository.findAll();
        }

        return result.stream()
                .map(this::getAppointmentResponseDTO)
                .sorted(Comparator
                        .comparing(AppointmentResponseDTO::getDate)
                        .thenComparing(AppointmentResponseDTO::getTime))
                .toList();
    }

    public AppointmentResponseDTO getAppointmentResponseDTO(Appointment appointment) {
        return appointmentMapper.toDTO(appointment);
    }

    public List<AppointmentResponseDTO> getAppointmentsForDoctorOnDate(Long doctorId, LocalDate date) {
        return appointmentRepository.findAppointmentsForDoctorOnDate(doctorId, date).stream()
                .map(a -> new AppointmentResponseDTO(
                        a.getDate().toString(),
                        a.getTime().toString(),
                        a.getStatus(),
                        a.getDescription(),
                        a.getDoctor().getUser().getFirstName(),
                        a.getUser().getFirstName()
                ))
                .toList();
    }

    @Transactional
    public void cancelAppointment(Long appointmentId, String currentUserEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

        User currentUser = userService.findUserByEmail(currentUserEmail);

        if (!appointment.getUser().getId().equals(currentUser.getId())) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You cannot cancel this appointment."
            );
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);

        User doctorUser = appointment.getDoctor().getUser();

        String msg = "Patient " + currentUser.getFirstName() + " " + currentUser.getLastName()
                + " cancelled the appointment on " + appointment.getDate()
                + " at " + appointment.getTime() + ".";

        notificationService.createNotification(doctorUser, msg);

        emailService.sendAppointmentCancelationEmailDoctor(
                doctorUser.getEmail(),
                appointment.getDate().toString(),
                appointment.getTime().toString()
        );
    }

    @Transactional
    public void doctorCancelAppointment(Long appointmentId, String currentDoctorEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

        User currentDoctor = userService.findUserByEmail(currentDoctorEmail);
        User appointmentDoctor = appointment.getDoctor().getUser();

        if (!appointmentDoctor.getId().equals(currentDoctor.getId())) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You cannot cancel this appointment."
            );
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);

        User patient = appointment.getUser();

        String msg = "Dr. " + currentDoctor.getFirstName() + " " + currentDoctor.getLastName()
                + " cancelled the appointment on " + appointment.getDate()
                + " at " + appointment.getTime() + ".";

        notificationService.createNotification(patient, msg);

        emailService.sendAppointmentCancelationEmailPatient(
                patient.getEmail(),
                appointment.getDate().toString(),
                appointment.getTime().toString(),
                currentDoctor.getLastName()
        );
    }

    @Transactional
    public void confirmAppointment(Long appointmentId, String currentDoctorEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

        User currentDoctor = userService.findUserByEmail(currentDoctorEmail);
        User appointmentPatient = appointment.getUser();
        User doctorUser = appointment.getDoctor().getUser();

        if (!doctorUser.getId().equals(currentDoctor.getId())) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You cannot confirm this appointment."
            );
        }

        appointment.setStatus(AppointmentStatus.CONFIRMED);
        appointmentRepository.save(appointment);

        String msg = "Dr. " + doctorUser.getLastName()
                + " confirmed the appointment on " + appointment.getDate()
                + " at " + appointment.getTime() + ".";

        notificationService.createNotification(appointmentPatient, msg);

        emailService.sendAppointmentConfirmationbyDoctor(
                appointmentPatient.getEmail(),
                appointment.getDate().toString(),
                appointment.getTime().toString(),
                doctorUser.getLastName()
        );
    }
}