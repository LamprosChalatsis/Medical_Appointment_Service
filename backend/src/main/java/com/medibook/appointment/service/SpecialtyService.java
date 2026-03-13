package com.medibook.appointment.service;


import com.medibook.appointment.dto.SpecialtyDTO;
import com.medibook.appointment.entities.Allergy;
import com.medibook.appointment.entities.Specialty;
import com.medibook.appointment.entities.User;
import com.medibook.appointment.mapper.SpecialtyMapper;
import com.medibook.appointment.repositories.SpecialtyRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SpecialtyService {

    private final SpecialtyRepository specialtyRepository;
    private final SpecialtyMapper specialtyMapper;
    private final UserService userService;

    public SpecialtyService(SpecialtyRepository specialtyRepository,  SpecialtyMapper specialtyMapper, UserService userService) {
        this.specialtyRepository = specialtyRepository;
        this.specialtyMapper = specialtyMapper;
        this.userService = userService;
    }

    @Transactional
    public void saveSpecialty(Specialty  specialty) {
        specialtyRepository.save(specialty);
    }

    @Transactional
    public List<SpecialtyDTO> getSpecialtiesDTO() {
        List<Specialty> specialties = specialtyRepository.findAll();

        return specialties.stream()
                .map(specialtyMapper::toDTO)
                .toList();
    }

    @Transactional
    public boolean findSpecialtyByName(String name) {
        Optional<Specialty> specialty = specialtyRepository.findByName(name);

        return specialty.isPresent();
    }

    public Specialty getOrCreateSpecialty(String name) {
        return specialtyRepository.findByName(name)
                .orElseGet(() -> {
                    Specialty newSpec = new Specialty();
                    newSpec.setName(name);
                    return specialtyRepository.save(newSpec);
                });
    }

    public List<SpecialtyDTO> getDoctorSpecialtiesDTO(String email) {
        User user = userService.findUserByEmail(email);
        List<Specialty> specialties = user.getDoctor_profile().getSpecialties();

        return specialties.stream()
                .map(specialtyMapper::toDTO)
                .toList();
    }

    public void addSpecialtyToDoctor(String email, long specialtyId) {
        User user = userService.findUserByEmail(email);

        Specialty specialty = specialtyRepository.findById(specialtyId)
                .orElseThrow(() -> new RuntimeException("Allergy not found"));

        List<Specialty> specialties = user.getDoctor_profile().getSpecialties();

        if(!specialties.contains(specialty)) {
            specialties.add(specialty);
        }
    }

    public void removeSpecialtyFromDoctor(String email, long specialtyId) {
        User user = userService.findUserByEmail(email);

        Specialty specialty = specialtyRepository.findById(specialtyId)
                .orElseThrow(() -> new RuntimeException("Allergy not found"));

        List<Specialty> specialties = user.getDoctorProfile().getSpecialties();

        specialties.remove(specialty);
    }
}
