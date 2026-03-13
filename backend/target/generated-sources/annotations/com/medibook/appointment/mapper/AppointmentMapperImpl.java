package com.medibook.appointment.mapper;

import com.medibook.appointment.dto.AppointmentResponseDTO;
import com.medibook.appointment.entities.Appointment;
import com.medibook.appointment.entities.Doctor_Profile;
import com.medibook.appointment.entities.User;
import java.time.format.DateTimeFormatter;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-13T12:22:26+0200",
    comments = "version: 1.5.0.Final, compiler: javac, environment: Java 21.0.8 (Oracle Corporation)"
)
@Component
public class AppointmentMapperImpl implements AppointmentMapper {

    @Override
    public AppointmentResponseDTO toDTO(Appointment appointment) {
        if ( appointment == null ) {
            return null;
        }

        AppointmentResponseDTO appointmentResponseDTO = new AppointmentResponseDTO();

        appointmentResponseDTO.setDoctorName( appointmentDoctorUserUsername( appointment ) );
        appointmentResponseDTO.setPatientName( appointmentUserUsername( appointment ) );
        appointmentResponseDTO.setId( appointment.getId() );
        if ( appointment.getDate() != null ) {
            appointmentResponseDTO.setDate( DateTimeFormatter.ISO_LOCAL_DATE.format( appointment.getDate() ) );
        }
        if ( appointment.getTime() != null ) {
            appointmentResponseDTO.setTime( DateTimeFormatter.ISO_LOCAL_TIME.format( appointment.getTime() ) );
        }
        appointmentResponseDTO.setDescription( appointment.getDescription() );
        appointmentResponseDTO.setStatus( appointment.getStatus() );

        return appointmentResponseDTO;
    }

    private String appointmentDoctorUserUsername(Appointment appointment) {
        if ( appointment == null ) {
            return null;
        }
        Doctor_Profile doctor = appointment.getDoctor();
        if ( doctor == null ) {
            return null;
        }
        User user = doctor.getUser();
        if ( user == null ) {
            return null;
        }
        String username = user.getUsername();
        if ( username == null ) {
            return null;
        }
        return username;
    }

    private String appointmentUserUsername(Appointment appointment) {
        if ( appointment == null ) {
            return null;
        }
        User user = appointment.getUser();
        if ( user == null ) {
            return null;
        }
        String username = user.getUsername();
        if ( username == null ) {
            return null;
        }
        return username;
    }
}
