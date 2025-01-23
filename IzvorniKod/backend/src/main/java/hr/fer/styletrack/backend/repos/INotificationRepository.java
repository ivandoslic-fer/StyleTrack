package hr.fer.styletrack.backend.repos;

import hr.fer.styletrack.backend.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface INotificationRepository extends JpaRepository<Notification, Long> {
    Optional<List<Notification>> findByReceiverId(Long receiverId);
    Optional<Notification> findById(long id);
}
