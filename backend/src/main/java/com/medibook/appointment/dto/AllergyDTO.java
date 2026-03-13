package com.medibook.appointment.dto;

public class AllergyDTO {

    private long id;
    private String allergy;

    public AllergyDTO(String allergy, long id) {
        this.allergy = allergy;
        this.id = id;
    }

    public String getAllergy() {
        return allergy;
    }

    public void setAllergy(String allergy) {
        this.allergy = allergy;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }
}
