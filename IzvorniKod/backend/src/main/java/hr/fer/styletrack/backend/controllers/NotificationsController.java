package hr.fer.styletrack.backend.controllers;

import hr.fer.styletrack.backend.dtos.NotificationRequest;
import hr.fer.styletrack.backend.entities.Notification;
import hr.fer.styletrack.backend.entities.User;
import hr.fer.styletrack.backend.repos.IItemRepository;
import hr.fer.styletrack.backend.repos.IUserRepository;
import hr.fer.styletrack.backend.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationsController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IItemRepository itemRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // For broadcasting notifications via WebSocket


    @GetMapping("/{userId}")
    public List<Notification> getNotificationsForUser(@PathVariable Long userId) {
        return notificationService.getNotificationsForUser(userId);
    }

    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        Notification notification = notificationService.findById(id);
        if (notification != null) {
            notification.setRead(true);
            notificationService.saveNotification(notification);
        }
    }

    @PostMapping
    public ResponseEntity<Notification> sendNotification(@RequestBody NotificationRequest request) {
        try {
            System.out.println(request);
            // Fetch the sender and receiver from the database
            User sender = request.getSenderId() != null ? userRepository.findById(request.getSenderId()).get() : null;
            User receiver = userRepository.findByUsername(request.getReceiverUsername()).get();

            if (receiver == null) {
                throw new IllegalArgumentException("Receiver not found");
            }

            // Create a new notification
            Notification notification = new Notification(
                    sender,
                    receiver,
                    itemRepository.findById(request.getItemId()).get(), // Add logic to fetch the item
                    request.getSenderContactInfo(),
                    request.getMessage()
            );

            // Save the notification to the database
            Notification savedNotification = notificationService.saveNotification(notification);

            // Broadcast the notification via WebSocket to the receiver
            messagingTemplate.convertAndSend(
                    "/topic/notifications/" + receiver.getUsername(),
                    savedNotification
            );

            return ResponseEntity.ok(savedNotification);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
