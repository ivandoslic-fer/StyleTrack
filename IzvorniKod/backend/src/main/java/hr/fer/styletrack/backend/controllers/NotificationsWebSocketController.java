package hr.fer.styletrack.backend.controllers;

import hr.fer.styletrack.backend.entities.Notification;
import hr.fer.styletrack.backend.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class NotificationsWebSocketController {

    @Autowired
    private NotificationService notificationService;

    @MessageMapping("/notifications") // Receive messages at /app/notifications
    @SendTo("/topic/notifications") // Broadcast to /topic/notifications
    public Notification sendNotification(Notification notification) {
        // Save the notification to the database
        return notificationService.saveNotification(notification);
    }
}
