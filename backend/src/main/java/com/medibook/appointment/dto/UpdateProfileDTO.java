package com.medibook.appointment.dto;

public class UpdateProfileDTO {
    private String firstName;
    private String lastName;
    private String phone;
    private String address;

    public UpdateProfileDTO(String address, String firstName, String lastName, String phone) {

        this.address = address;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
