package com.medibook.appointment.service;

import com.medibook.appointment.entities.Notification;
import com.medibook.appointment.entities.User;
import com.medibook.appointment.repositories.NotificationRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public void createNotification(User user, String message) {

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setRead(false);

        notificationRepository.save(notification);
    }

    @Transactional
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long id, Long userId) {
        Notification notification = notificationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new AccessDeniedException(
                        "You are not allowed to modify this notification."
                ));

        notification.setRead(true);
    }
}
