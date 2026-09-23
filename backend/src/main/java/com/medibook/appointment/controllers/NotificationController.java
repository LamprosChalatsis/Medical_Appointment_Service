package com.medibook.appointment.controllers;

import com.medibook.appointment.dto.NotificationDTO;
import com.medibook.appointment.repositories.NotificationRepository;
import com.medibook.appointment.service.NotificationService;
import com.medibook.appointment.service.UserDetailsImpl;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationService notificationService, NotificationRepository notificationRepository) {
        this.notificationService = notificationService;
        this.notificationRepository = notificationRepository;
    }

    @GetMapping("/unread")
    public List<NotificationDTO> getUnreadNotifications(Authentication authentication) {
        Long id = ((UserDetailsImpl) authentication.getPrincipal()).getId();

        return notificationRepository
                .findByUserIdAndReadFalse(id)
                .stream()
                .map(NotificationDTO::new)
                .toList();
    }

    @PatchMapping("/read/{id}")
    public void markAsRead(@PathVariable Long id, Authentication authentication) {
        Long userId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        notificationService.markAsRead(id, userId);
    }
}
