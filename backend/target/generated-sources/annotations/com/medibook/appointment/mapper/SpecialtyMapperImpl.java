package com.medibook.appointment.mapper;

import com.medibook.appointment.dto.SpecialtyDTO;
import com.medibook.appointment.entities.Specialty;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-06T01:53:36+0300",
    comments = "version: 1.5.0.Final, compiler: javac, environment: Java 21.0.4 (Oracle Corporation)"
)
@Component
public class SpecialtyMapperImpl implements SpecialtyMapper {

    @Override
    public SpecialtyDTO toDTO(Specialty specialty) {
        if ( specialty == null ) {
            return null;
        }

        String name = null;
        long id = 0L;

        name = specialty.getName();
        if ( specialty.getId() != null ) {
            id = specialty.getId();
        }

        SpecialtyDTO specialtyDTO = new SpecialtyDTO( id, name );

        return specialtyDTO;
    }
}
