package com.medibook.appointment.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.medibook.appointment.entities.Role;
import com.medibook.appointment.entities.User;
import com.medibook.appointment.repositories.RoleRepository;
import com.medibook.appointment.repositories.UserRepository;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;



@Configuration
public class AppConfig {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private BCryptPasswordEncoder encoder;

    @Value("${app.seed.admin.username:}")
    private String adminUsername;

    @Value("${app.seed.admin.email:}")
    private String adminEmail;

    @Value("${app.seed.admin.password:}")
    private String adminPassword;

    public AppConfig(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        encoder = new BCryptPasswordEncoder();
    }

    @Bean
    public CommandLineRunner initRolesAndAdmin() {
        return args -> {
            System.out.println("Initializing roles...");

            Role userRole = roleRepository.findByName("ROLE_USER")
                    .orElseGet(() -> {
                        System.out.println("Creating ROLE_USER");
                        return roleRepository.save(new Role("ROLE_USER"));
                    });

            Role patientRole = roleRepository.findByName("ROLE_PATIENT")
                    .orElseGet(() -> {
                        System.out.println("Creating ROLE_PATIENT");
                        return roleRepository.save(new Role("ROLE_PATIENT"));
                    });

            Role doctorRole = roleRepository.findByName("ROLE_DOCTOR")
                    .orElseGet(() -> {
                        System.out.println("Creating ROLE_DOCTOR");
                        return roleRepository.save(new Role("ROLE_DOCTOR"));
                    });

            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseGet(() -> {
                        System.out.println("Creating ROLE_ADMIN");
                        return roleRepository.save(new Role("ROLE_ADMIN"));
                    });

            System.out.println("Role initialization finished.");

            if (adminUsername.isBlank() || adminPassword.isBlank() || adminEmail.isBlank()) {
                System.out.println("Admin seed skipped: missing configuration.");
                return;
            }

            if (userRepository.findByUsername(adminUsername).isEmpty()) {
                User admin = new User();
                admin.setUsername(adminUsername);
                admin.setEmail(adminEmail);
                admin.setPassword(encoder.encode(adminPassword));
                admin.setEnabled(true);
                admin.getRoles().add(adminRole);

                userRepository.save(admin);
                System.out.println("Default admin created.");
            } else {
                System.out.println("Default admin already exists.");
            }
        };
    }


    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {return new BCryptPasswordEncoder();}
    
    private SecurityScheme createAPIKeyScheme() {
        return new SecurityScheme().type(SecurityScheme.Type.HTTP)
                .bearerFormat("JWT")
                .scheme("bearer");
    }

    @Bean
    public OpenAPI openAPI() {
        OpenAPI info = new OpenAPI().addSecurityItem(new SecurityRequirement().
                        addList("Bearer Authentication"))
                .components(new Components().addSecuritySchemes
                        ("Bearer Authentication", createAPIKeyScheme()))
                .info(new Info().title("Medical Appointment Service")
                        .description("This API is used in DevOps project")
                        .version("1.0").contact(new Contact().name("Lampros Chalatsis")
                                .email("lambroshalatsis154@gmail.com"))
                        .license(new License().name("License of API")
                                .url("https://swagger.io/license/")));
        return info;
    }
}

