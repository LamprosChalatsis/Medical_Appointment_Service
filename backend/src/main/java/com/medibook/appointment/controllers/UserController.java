package com.medibook.appointment.controllers;

import com.medibook.appointment.dto.UpdateProfileDTO;
import com.medibook.appointment.dto.UserDTO;
import com.medibook.appointment.dto.UserProfileDTO;
import com.medibook.appointment.entities.Role;
import com.medibook.appointment.entities.User;
import com.medibook.appointment.repositories.RoleRepository;
import com.medibook.appointment.service.EmailService;
import com.medibook.appointment.service.UserDetailsServiceImpl;
import com.medibook.appointment.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private UserService userService;
    private RoleRepository roleRepository;
    private final EmailService emailService;

    public UserController(UserService userService,  RoleRepository roleRepository,  EmailService emailService) {
        this.userService = userService;
        this.roleRepository = roleRepository;
        this.emailService = emailService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserDTO> getUsers() {
        return userService.getUsersDTO();
    }

    @GetMapping("{user_id}")
    public ResponseEntity<User> getUser(@PathVariable Long user_id) {
        return userService.getUser(user_id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{user_id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Long user_id) {
        boolean result = this.userService.deleteUserById(user_id);
        if (result) {
            return ResponseEntity.status(HttpStatus.OK).body("User deleted successfully");
        }
        else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @PutMapping("{user_id}")
    public ResponseEntity<String> updateUser(@PathVariable Long user_id, @RequestBody User updatedUser) {
        Optional<User> optionalUser = userService.getUser(user_id);
        if(optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setEmail(updatedUser.getEmail());
            user.setUsername(updatedUser.getUsername());
            user.setAddress(updatedUser.getAddress());
            user.setPhone(updatedUser.getPhone());
            userService.updateUser(user);
            return ResponseEntity.ok("User updated successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

    }

    @PatchMapping("/{user_id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> approveUser(@PathVariable Long user_id) {
        Optional<User> optionalUser = userService.getUser(user_id);
        if(optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setEnabled(true);
            userService.updateUser(user);
            emailService.sendApprovalStatusEmail(user.getEmail()); // Send email to inform user his account has been approved
            return ResponseEntity.ok("User approved successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
    }

    @PostMapping("/{user_id}/roles/{role_id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> addRoleToUser(@PathVariable Long user_id, @PathVariable Long role_id){
        Optional<User> optionalUser = userService.getUser(user_id);
        if(optionalUser.isPresent()) {
            User user = optionalUser.get();
            Role role = roleRepository.findById(role_id).get();
            user.getRoles().add(role);
            System.out.println("Roles: "+user.getRoles());
            userService.updateUser(user);
            return ResponseEntity.ok("Role added successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
    }

    @DeleteMapping("/{user_id}/roles/{role_id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteRoleFromUser(@PathVariable Long user_id, @PathVariable Long role_id){
        Optional<User> optionalUser = userService.getUser(user_id);
        if(optionalUser.isPresent()) {
            User user = optionalUser.get();
            Role role = roleRepository.findById(role_id).get();
            user.getRoles().remove(role);
            System.out.println("Roles: "+user.getRoles());
            userService.updateUser(user);
            return ResponseEntity.status(HttpStatus.OK).body("Role deleted successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
    }

    // Settings
    @GetMapping("/profile")
    public UserProfileDTO getProfile(Authentication authentication) {
        String username = authentication.getName();
        return userService.getProfile(username);
    }

    @PutMapping("/profile")
    public UserProfileDTO updateProfile(@RequestBody UpdateProfileDTO dto, Authentication authentication) {
        String username = authentication.getName();
        return userService.updateProfile(username, dto);
    }



}
