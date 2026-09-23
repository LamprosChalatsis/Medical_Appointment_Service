package com.medibook.appointment.repositories;

import com.medibook.appointment.entities.Notification;
import com.medibook.appointment.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdAndReadFalse(Long userId);

    List<Notification> findByUserAndReadFalse(User user);

    Optional<Notification> findByIdAndUserId(Long id, Long userId);
}