package com.medibook.appointment.repositories;


import com.medibook.appointment.entities.Allergy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface AllergyRepository extends JpaRepository<Allergy, Long> {
    Collection<Object> findByAllergy(String name);
}
