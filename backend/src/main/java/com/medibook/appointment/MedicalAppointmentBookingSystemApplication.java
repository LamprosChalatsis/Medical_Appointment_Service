package com.medibook.appointment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MedicalAppointmentBookingSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(MedicalAppointmentBookingSystemApplication.class, args);
	}

}
