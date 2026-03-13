package com.medibook.appointment.controllers;

import com.medibook.appointment.dto.AllergyDTO;
import com.medibook.appointment.service.AllergyService;
import com.medibook.appointment.service.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/allergies")
public class AllergyController {

    private final AllergyService allergyService;

    public AllergyController(AllergyService allergyService) {
        this.allergyService = allergyService;
    }

    @GetMapping
    public List<AllergyDTO> getAllAllergies() {
        return allergyService.getAllAllergiesDTO();
    }

    @GetMapping("/patient")
    public List<AllergyDTO> getPatientAllergies(Authentication authentication) {
        String email = ((UserDetailsImpl) authentication.getPrincipal()).getEmail();
        return allergyService.getPatientAllergiesDTO(email);
    }

    @PostMapping("/patient/{allergyId}")
    public ResponseEntity<?> addAllergyToPatient(@PathVariable Long allergyId, Authentication authentication) {
        String email = ((UserDetailsImpl) authentication.getPrincipal()).getEmail();
        allergyService.addAllergyToPatient(email, allergyId);
        return ResponseEntity.ok(Map.of("message", "Allergy successfully added"));
    }

    @DeleteMapping("/patient/{allergyId}")
    public ResponseEntity<?> removeAllergyFromPatient(@PathVariable Long allergyId, Authentication authentication) {
        String email = ((UserDetailsImpl) authentication.getPrincipal()).getEmail();
        allergyService.removeAllergyFromPatient(email, allergyId);
        return ResponseEntity.ok(Map.of("message", "Allergy removed from patient"));
    }
}