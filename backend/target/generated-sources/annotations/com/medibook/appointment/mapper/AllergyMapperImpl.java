package com.medibook.appointment.mapper;

import com.medibook.appointment.dto.AllergyDTO;
import com.medibook.appointment.entities.Allergy;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-06T01:53:36+0300",
    comments = "version: 1.5.0.Final, compiler: javac, environment: Java 21.0.4 (Oracle Corporation)"
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
