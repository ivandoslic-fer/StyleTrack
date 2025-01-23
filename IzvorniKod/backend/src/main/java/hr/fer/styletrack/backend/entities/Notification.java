package hr.fer.styletrack.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", referencedColumnName = "id", nullable = true)
    @JsonIgnore
    private User sender; // Optional, for anonymous users

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", referencedColumnName = "id", nullable = false)
    @JsonIgnore
    private User receiver; // The user who will receive the notification

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", referencedColumnName = "itemId", nullable = false)
    @JsonIgnore
    private Item item; // The item for which the notification is being sent

    @Column(nullable = true)
    private String senderContactInfo; // Optional contact info provided by the sender

    @Column(nullable = false)
    private String message; // A short message

    @Column(nullable = false)
    private boolean isRead = false; // Default is unread

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now(); // Timestamp of creation

    public Notification() { }

    public Notification(User sender, User receiver, Item item, String senderContactInfo, String message) {
        this.sender = sender;
        this.receiver = receiver;
        this.senderContactInfo = senderContactInfo;
        this.item = item;
        this.message = message;
    }
}
