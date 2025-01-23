package hr.fer.styletrack.backend.services;

import hr.fer.styletrack.backend.entities.Notification;
import hr.fer.styletrack.backend.repos.INotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private INotificationRepository notificationRepository;

    public Notification saveNotification(Notification notification) {
        try {
            return notificationRepository.save(notification);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public Notification findById(Long id) {
        return notificationRepository.findById(id).orElse(null);
    }

    public List<Notification> getNotificationsForUser(Long userId) {
        List<Notification> res;
        try {
            var tmp = notificationRepository.findByReceiverId(userId);
            res = tmp.orElseGet(ArrayList::new);
        } catch (Exception e) {
            return new ArrayList<>();
        }
        return res;
    }
}
