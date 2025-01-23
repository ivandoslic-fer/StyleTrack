package hr.fer.styletrack.backend.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String displayName;
    private String profilePictureUrl;
    private boolean isAdvertiser;

    public UserDto(Long id, String username, String email, String displayName, String profilePictureUrl, boolean isAdvertiser) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.displayName = displayName;
        this.profilePictureUrl = profilePictureUrl;
        this.isAdvertiser = isAdvertiser;
    }

    @Override
    public String toString() {
        return "{"
                + "        \"id\":\"" + id + "\""
                + ",         \"username\":\"" + username + "\""
                + ",         \"email\":\"" + email + "\""
                + ",         \"displayName\":\"" + displayName + "\""
                + ",         \"profilePictureUrl\":\"" + profilePictureUrl + "\""
                + "}";
    }
}
