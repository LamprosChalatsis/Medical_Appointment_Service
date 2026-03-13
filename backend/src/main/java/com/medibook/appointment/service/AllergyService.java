package com.medibook.appointment.service;

import com.medibook.appointment.dto.AllergyDTO;
import com.medibook.appointment.entities.Allergy;
import com.medibook.appointment.entities.User;
import com.medibook.appointment.mapper.AllergyMapper;
import com.medibook.appointment.repositories.AllergyRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AllergyService {

    private final AllergyRepository allergyRepository;
    private final AllergyMapper allergyMapper;
    private final UserService userService;

    public AllergyService(AllergyRepository allergyRepository,
                          AllergyMapper allergyMapper,
                          UserService userService) {
        this.allergyRepository = allergyRepository;
        this.allergyMapper = allergyMapper;
        this.userService = userService;
    }

    @Transactional
    public List<AllergyDTO> getAllAllergiesDTO() {
        List<Allergy> allergies = allergyRepository.findAll();

        return allergies.stream()
                .map(allergyMapper::toDTO)
                .toList();


    }

    @Transactional
    public List<AllergyDTO> getPatientAllergiesDTO(String email) {
        User user = userService.findUserByEmail(email);
        List<Allergy> allergies = user.getPatientProfile().getAllergies();

        return allergies.stream()
                .map(allergyMapper::toDTO)
                .toList();
    }

    @Transactional
    public void addAllergyToPatient(String email, Long allergyId) {

        User user = userService.findUserByEmail(email);

        Allergy allergy = allergyRepository.findById(allergyId)
                .orElseThrow(() -> new RuntimeException("Allergy not found"));

        List<Allergy> allergies = user.getPatientProfile().getAllergies();

        if (!allergies.contains(allergy)) {
            allergies.add(allergy);
        }
    }

    @Transactional
    public void removeAllergyFromPatient(String email, Long allergyId) {

        User user = userService.findUserByEmail(email);

        Allergy allergy = allergyRepository.findById(allergyId)
                .orElseThrow(() -> new RuntimeException("Allergy not found"));

        List<Allergy> allergies = user.getPatientProfile().getAllergies();

        allergies.remove(allergy);
    }
}
