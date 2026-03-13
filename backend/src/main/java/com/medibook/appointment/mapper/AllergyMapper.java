package com.medibook.appointment.mapper;

import com.medibook.appointment.dto.AllergyDTO;
import com.medibook.appointment.entities.Allergy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AllergyMapper {
    @Mapping(target = "allergy", source = "allergy")
    @Mapping(target = "id", source="id")
    AllergyDTO toDTO(Allergy allergy);
}
