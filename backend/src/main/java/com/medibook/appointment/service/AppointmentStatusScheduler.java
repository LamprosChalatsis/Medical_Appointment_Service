package com.medibook.appointment.service;

import com.medibook.appointment.entities.Appointment;
import com.medibook.appointment.entities.AppointmentStatus;
import com.medibook.appointment.repositories.AppointmentRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class AppointmentStatusScheduler {

    private final AppointmentRepository appointmentRepository;

    public AppointmentStatusScheduler(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @Scheduled(fixedRate = 600000)
    public void markCompletedAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();

        LocalDateTime now = LocalDateTime.now();

        for (Appointment appointment : appointments) {
            if (appointment.getStatus() == AppointmentStatus.CONFIRMED) {
                LocalDate date = appointment.getDate();
                LocalTime time = appointment.getTime();

                LocalDateTime appointmentDateTime = LocalDateTime.of(date, time);

                if (appointmentDateTime.isBefore(now)) {
                    appointment.setStatus(AppointmentStatus.COMPLETED);
                    appointmentRepository.save(appointment);
                }
            }
        }
    }
}