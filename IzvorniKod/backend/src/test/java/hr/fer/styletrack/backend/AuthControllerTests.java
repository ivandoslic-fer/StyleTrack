package hr.fer.styletrack.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import hr.fer.styletrack.backend.controllers.AuthController;
import hr.fer.styletrack.backend.dtos.LoginRequest;
import hr.fer.styletrack.backend.dtos.RegisterRequest;
import hr.fer.styletrack.backend.entities.User;
import hr.fer.styletrack.backend.repos.IUserRepository;
import hr.fer.styletrack.backend.utils.JwtUtil;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@TestPropertySource(locations = "classpath:application-integrationtest.properties")
@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private IUserRepository userRepository;

    @MockBean
    private PasswordEncoder passwordEncoder;

    // Add any other mocked dependencies
    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private JwtUtil jwtUtil;

    @Test
    void shouldRegisterSuccessfully() throws Exception {
        // Arrange
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername("newUser");
        registerRequest.setPassword("password123");
        registerRequest.setEmail("newuser@test.com");
        registerRequest.setDisplayName("New User");
        registerRequest.setAdvertiser(false);

        Mockito.when(userRepository.findByEmail(registerRequest.getEmail())).thenReturn(Optional.empty());
        Mockito.when(userRepository.findByUsername(registerRequest.getUsername())).thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(content().string("User registered successfully"));
    }

    @Test
    void shouldLoginSuccessfully() throws Exception {
        // Arrange
        String username = "testUser";
        String password = "password123";

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));

        Mockito.when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        Mockito.when(authenticationManager.authenticate(Mockito.any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        Mockito.when(jwtUtil.generateToken(username, user)).thenReturn("dummy-jwt-token");

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername(username);
        loginRequest.setPassword(password);

        // Act & Assert
        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("dummy-jwt-token"))
                .andExpect(jsonPath("$.username").value(username));
    }

    @Test
    void shouldFailLoginWithInvalidPassword() throws Exception {
        // Arrange
        String username = "testUser";
        String wrongPassword = "wrongPassword";

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode("correctPassword"));

        Mockito.when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        Mockito.when(authenticationManager.authenticate(Mockito.any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new RuntimeException("Invalid credentials"));

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername(username);
        loginRequest.setPassword(wrongPassword);

        // Act & Assert
        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldFailRegisterWhenEmailExists() throws Exception {
        // Arrange
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername("newUser");
        registerRequest.setPassword("password123");
        registerRequest.setEmail("existing@test.com");
        registerRequest.setDisplayName("New User");
        registerRequest.setAdvertiser(false);

        User existingUser = new User();
        existingUser.setEmail(registerRequest.getEmail());

        Mockito.when(userRepository.findByEmail(registerRequest.getEmail())).thenReturn(Optional.of(existingUser));

        // Act & Assert
        mockMvc.perform(post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Email is already taken"));
    }
}
