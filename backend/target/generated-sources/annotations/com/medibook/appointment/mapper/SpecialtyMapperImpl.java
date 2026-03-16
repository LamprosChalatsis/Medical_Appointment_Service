package com.medibook.appointment.mapper;

import com.medibook.appointment.dto.SpecialtyDTO;
import com.medibook.appointment.entities.Specialty;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-16T23:30:14+0200",
    comments = "version: 1.5.0.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
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
