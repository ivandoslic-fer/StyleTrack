package hr.fer.styletrack.backend.dtos;

import lombok.Getter;

@Getter
public class LoginResponse {
    private String token;
    private String username;
    private UserDto user;

    public LoginResponse(String token, String username, UserDto user) {
        this.token = token;
        this.username = username;
        this.user = user;
    }
}
