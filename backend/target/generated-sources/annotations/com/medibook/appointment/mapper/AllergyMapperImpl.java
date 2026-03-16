package com.medibook.appointment.mapper;

import com.medibook.appointment.dto.AllergyDTO;
import com.medibook.appointment.entities.Allergy;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-14T01:31:31+0200",
    comments = "version: 1.5.0.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class AllergyMapperImpl implements AllergyMapper {

    @Override
    public AllergyDTO toDTO(Allergy allergy) {
        if ( allergy == null ) {
            return null;
        }

        String allergy1 = null;
        long id = 0L;

        allergy1 = allergy.getAllergy();
        id = allergy.getId();

        AllergyDTO allergyDTO = new AllergyDTO( allergy1, id );

        return allergyDTO;
    }
}
