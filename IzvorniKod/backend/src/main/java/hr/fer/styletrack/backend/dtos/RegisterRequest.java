package hr.fer.styletrack.backend.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String username;
    private String password;
    private String email;
    private String displayName;
    private String address;
    private String website;
    private boolean advertiser;
}
