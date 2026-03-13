package com.medibook.appointment.mapper;

import com.medibook.appointment.dto.DoctorDTO;
import com.medibook.appointment.entities.Doctor_Profile;
import com.medibook.appointment.entities.Specialty;
import com.medibook.appointment.entities.User;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-13T12:22:26+0200",
    comments = "version: 1.5.0.Final, compiler: javac, environment: Java 21.0.8 (Oracle Corporation)"
)
@Component
public class DoctorMapperImpl implements DoctorMapper {

    @Override
    public DoctorDTO toDTO(Doctor_Profile doctor) {
        if ( doctor == null ) {
            return null;
        }

        String username = null;
        String location = null;
        Long id = null;
        List<Specialty> specialties = null;

        username = doctorUserUsername( doctor );
        location = doctorUserAddress( doctor );
        id = doctor.getId();
        List<Specialty> list = doctor.getSpecialties();
        if ( list != null ) {
            specialties = new ArrayList<Specialty>( list );
        }

        DoctorDTO doctorDTO = new DoctorDTO( id, username, specialties, location );

        return doctorDTO;
    }

    private String doctorUserUsername(Doctor_Profile doctor_Profile) {
        if ( doctor_Profile == null ) {
            return null;
        }
        User user = doctor_Profile.getUser();
        if ( user == null ) {
            return null;
        }
        String username = user.getUsername();
        if ( username == null ) {
            return null;
        }
        return username;
    }

    private String doctorUserAddress(Doctor_Profile doctor_Profile) {
        if ( doctor_Profile == null ) {
            return null;
        }
        User user = doctor_Profile.getUser();
        if ( user == null ) {
            return null;
        }
        String address = user.getAddress();
        if ( address == null ) {
            return null;
        }
        return address;
    }
}
