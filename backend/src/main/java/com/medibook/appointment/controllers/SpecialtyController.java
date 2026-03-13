package com.medibook.appointment.controllers;


import com.medibook.appointment.dto.SpecialtyDTO;
import com.medibook.appointment.entities.Specialty;
import com.medibook.appointment.service.SpecialtyService;
import com.medibook.appointment.service.UserDetailsImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/specialties")
public class SpecialtyController {

    private SpecialtyService  specialtyService;

    public SpecialtyController(SpecialtyService specialtyService) {
        this.specialtyService = specialtyService;
    }

    @GetMapping()
    public List<SpecialtyDTO> getSpecialties() {
        return specialtyService.getSpecialtiesDTO();
    }

    @PostMapping("/new")
    public ResponseEntity<String> createSpecialty(@RequestBody SpecialtyDTO specialty) {
        boolean exists = specialtyService.findSpecialtyByName(specialty.getName());
        if (exists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } else {
            Specialty newSpecialty = new Specialty();
            newSpecialty.setName(specialty.getName());
            specialtyService.saveSpecialty(newSpecialty);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        }
    }

    @GetMapping("/doctor")
    public List<SpecialtyDTO> getDoctorSpecialties(Authentication authentication) {
        String email = ((UserDetailsImpl) authentication.getPrincipal()).getEmail();
        return specialtyService.getDoctorSpecialtiesDTO(email);
    }

    @PostMapping("/doctor/{specialtyId}")
    public ResponseEntity<?> addSpecialtyToDoctor(@PathVariable Long specialtyId, Authentication authentication) {
        String email = ((UserDetailsImpl) authentication.getPrincipal()).getEmail();
        specialtyService.addSpecialtyToDoctor(email, specialtyId);
        return ResponseEntity.ok(Map.of("message", "Specialty successfully added"));

    }

    @DeleteMapping("/doctor/{specialtyId}")
    public ResponseEntity<?> removeSpecialtyFromDoctor(@PathVariable Long specialtyId, Authentication authentication) {
        String email = ((UserDetailsImpl) authentication.getPrincipal()).getEmail();
        specialtyService.removeSpecialtyFromDoctor (email, specialtyId);
        return ResponseEntity.ok(Map.of("message", "Allergy removed from patient"));
    }
}
