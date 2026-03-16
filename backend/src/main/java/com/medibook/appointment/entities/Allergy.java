package com.medibook.appointment.entities;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Allergy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String allergy;

    @ManyToMany(mappedBy = "allergies")
    private List<Patient_Profile> patientProfiles;

    public Allergy() {}

    public Allergy(String allergy) {
        this.allergy = allergy;
    }

    public Allergy(String allergy, int id, List<Patient_Profile> patientProfiles) {
        this.allergy = allergy;
        this.id = id;
        this.patientProfiles = patientProfiles;
    }

    public String getAllergy() {
        return allergy;
    }

    public void setAllergy(String allergy) {
        this.allergy = allergy;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public List<Patient_Profile> getPatientProfiles() {
        return patientProfiles;
    }

    public void setPatientProfiles(List<Patient_Profile> patientProfiles) {
        this.patientProfiles = patientProfiles;
    }

    @Override
    public String toString() {
        return "Allergy{" +
                "allergy='" + allergy + '\'' +
                ", id=" + id +
                ", patientProfiles=" + patientProfiles +
                '}';
    }
}
