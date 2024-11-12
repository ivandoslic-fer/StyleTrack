package hr.fer.styletrack.backend.controllers;

import hr.fer.styletrack.backend.dtos.LoginRequest;
import hr.fer.styletrack.backend.dtos.LoginResponse;
import hr.fer.styletrack.backend.dtos.RegisterRequest;
import hr.fer.styletrack.backend.dtos.UserDto;
import hr.fer.styletrack.backend.entities.AdvertiserProfile;
import hr.fer.styletrack.backend.entities.Role;
import hr.fer.styletrack.backend.entities.User;
import hr.fer.styletrack.backend.repos.IAdvertiserProfileRepository;
import hr.fer.styletrack.backend.repos.IRoleRepository;
import hr.fer.styletrack.backend.repos.IUserRepository;
import hr.fer.styletrack.backend.utils.JwtUtil;
import hr.fer.styletrack.backend.utils.StyleTrackConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AuthController {
    private final IUserRepository userRepository;
    private final IAdvertiserProfileRepository advertiserProfileRepository;
    private final IRoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthController(IUserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil,
                          AuthenticationManager authenticationManager,
                          IAdvertiserProfileRepository advertiserProfileRepository,
                          IRoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.advertiserProfileRepository = advertiserProfileRepository;
        this.roleRepository = roleRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            Optional<User> user = userRepository.findByUsername(loginRequest.getUsername());

            if (!user.isPresent()) {
                throw new UsernameNotFoundException(loginRequest.getUsername());
            }

            // Generate JWT
            String jwt = jwtUtil.generateToken(loginRequest.getUsername(), user.get());
            return ResponseEntity.ok(new LoginResponse(jwt, loginRequest.getUsername(), new UserDto(user.get().getId(), user.get().getUsername(), user.get().getEmail(), user.get().getDisplayName())));  // Return the token

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest registerRequest) {
        // Check if user already exists
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already taken");
        }

        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is already taken");
        }

        /*if (registerRequest.isAdvertiser() && (userRepository.findByUsername(registerRequest.getUsername()).get()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Advertiser profile already exists");
        }*/

        // Create new user with hashed password
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEmail(registerRequest.getEmail());
        user.setDisplayName(registerRequest.getDisplayName());
        user.setAdvertiser(registerRequest.isAdvertiser());

        // TODO: Get the role from 'role' table and then assign it to user so you don't make duplicated roles!
        //user.setRoles(registerRequest.isAdvertiser() ? List.of(new Role(StyleTrackConstants.ADVERTISER_USER_ROLE)) : List.of(new Role(StyleTrackConstants.PERSONAL_USER_ROLE)));
        String roleName = registerRequest.isAdvertiser() ? StyleTrackConstants.ADVERTISER_USER_ROLE : StyleTrackConstants.PERSONAL_USER_ROLE;
        Role role = roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(roleName)));

        
        Role role_common = roleRepository.findByName(StyleTrackConstants.COMMON_USER_ROLE)
                .orElseGet(() -> roleRepository.save(new Role(StyleTrackConstants.COMMON_USER_ROLE)));

        user.setRoles(List.of(role_common, role));
        userRepository.save(user);

        if (registerRequest.isAdvertiser()) {
            AdvertiserProfile advertiserProfile = new AdvertiserProfile();
            advertiserProfile.setCompanyAddress(registerRequest.getAddress());
            advertiserProfile.setCompanyWebsite(registerRequest.getWebsite());
            advertiserProfile.setUser(user);
            advertiserProfileRepository.save(advertiserProfile);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
    }
}