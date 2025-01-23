package hr.fer.styletrack.backend.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationRequest {
    private Long senderId; // Optional for anonymous users
    private String receiverUsername; // Required
    private Long itemId; // Required
    private String senderContactInfo; // Optional
    private String message; // Required

    @Override
    public String toString() {
        return "{"
                + "        \"senderId\":\"" + senderId + "\""
                + ",         \"receiverUsername\":\"" + receiverUsername + "\""
                + ",         \"itemId\":\"" + itemId + "\""
                + ",         \"senderContactInfo\":\"" + senderContactInfo + "\""
                + ",         \"message\":\"" + message + "\""
                + "}";
    }
}