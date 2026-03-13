package com.medibook.appointment.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

@Entity
@Table(name = "Specialties")
public class Specialty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true)
    private String name;

    @ManyToMany(mappedBy = "specialties")
    @JsonIgnore
    private List<Doctor_Profile> doctors;

    public Specialty() {}

    public Specialty(List<Doctor_Profile> doctors, Long id, String name) {
        this.doctors = doctors;
        this.id = id;
        this.name = name;
    }

    public List<Doctor_Profile> getDoctors() {
        return doctors;
    }

    public void setDoctors(List<Doctor_Profile> doctors) {
        this.doctors = doctors;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "Specialty{" +
                "doctors=" + doctors +
                ", id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
