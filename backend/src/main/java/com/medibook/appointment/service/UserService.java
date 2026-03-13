package com.medibook.appointment.service;

import com.medibook.appointment.dto.DoctorDTO;
import com.medibook.appointment.dto.UpdateProfileDTO;
import com.medibook.appointment.dto.UserDTO;
import com.medibook.appointment.dto.UserProfileDTO;
import com.medibook.appointment.entities.Doctor_Profile;
import com.medibook.appointment.entities.Role;
import com.medibook.appointment.entities.User;
import com.medibook.appointment.mapper.UserMapper;
import com.medibook.appointment.repositories.RoleRepository;
import com.medibook.appointment.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final EmailService emailService;

    public UserService(UserRepository userRepository, RoleRepository roleRepository,  UserMapper userMapper,  EmailService emailService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userMapper = userMapper;
        this.emailService = emailService;
    }

    @Transactional
    public boolean deleteUserById(final Long user_id) {
        final Optional<User> userOptional = this.userRepository.findById(user_id);
        if (userOptional.isEmpty()) {
            return false;
        }
        User user = userOptional.get();
        emailService.sendDeleteEmail(user.getEmail()); // Send Delete email

        this.userRepository.deleteById(user_id);
        return true;
    }

    @Transactional
    public void updateUser(User user) {
        userRepository.save(user);
    }

    @Transactional
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUser(Long userId) {
        return userRepository.findById(userId);
    }

    @Transactional
    public User findUserByEmail(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Transactional
    public Optional<User> findUserByUsername(String username)  {
        return userRepository.findByUsername(username);
    }

    public boolean approveUser(Long id) {
        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            if (!user.isEnabled()) {
                user.setEnabled(true);
                userRepository.save(user);
                return true;
            }
        }

        return false;
    }

    @Transactional
    public void updateOrInsertRole(Role role) {
        roleRepository.updateOrInsert(role);
    }

    public List<UserDTO> getUsersDTO() {
        List<User> users = userRepository.findAll();
        List<UserDTO> userDTOs = new ArrayList<>();
        for(User user : users) {
            userDTOs.add(userMapper.toDTO(user));
        }
        return userDTOs;
    }

    public UserProfileDTO getProfile(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserProfileDTO(
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                user.getAddress()
        );
    }
    public UserProfileDTO updateProfile(String username, UpdateProfileDTO dto) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPhone(dto.getPhone());
        user.setAddress(dto.getAddress());

        userRepository.save(user);

        return new UserProfileDTO(
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                user.getAddress()
        );
    }


}
