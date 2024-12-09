package hr.fer.styletrack.backend.controllers;

import hr.fer.styletrack.backend.dtos.UserDto;
import hr.fer.styletrack.backend.entities.User;
import hr.fer.styletrack.backend.misc.StyleTrackUserDetails;
import hr.fer.styletrack.backend.repos.IUserRepository;
import hr.fer.styletrack.backend.services.ImagekitService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;


@RestController
@AllArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/api/users")
public class UsersController {

    private final IUserRepository userRepository;
    private final ImagekitService imagekitService;

    @GetMapping("/")
    public ResponseEntity<List<UserDto>> getUsers() {
        List<User> users = userRepository.findAll();
        List<UserDto> userDtos = users.stream().map(user -> new UserDto(user.getId(), user.getUsername(), user.getEmail(), user.getDisplayName(), user.getProfilePicture())).toList();
        return ResponseEntity.ok(userDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(new UserDto(user.get().getId(), user.get().getUsername(), user.get().getEmail(), user.get().getDisplayName(), user.get().getProfilePicture()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserDto> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userRepository.findByUsername(username); // Assuming this method exists in the repository
        return user.map(value -> ResponseEntity.ok(new UserDto(value.getId(), value.getUsername(), value.getEmail(), user.get().getDisplayName(), user.get().getProfilePicture())))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("#id == principal.user.id") // Ovako provjeravati je li korisnik onaj za kojeg se predstavlja da je
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
        Optional<User> user = userRepository.findById(id);

        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        System.out.println(userDto);

        user.get().setEmail(userDto.getEmail());
        user.get().setDisplayName(userDto.getDisplayName());
        user.get().setUsername(userDto.getUsername());

        userRepository.save(user.get());

        return ResponseEntity.ok(new UserDto(user.get().getId(), user.get().getUsername(), user.get().getEmail(), user.get().getDisplayName(), user.get().getProfilePicture()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("#id == principal.user.id")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);

        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        userRepository.delete(user.get());
        return ResponseEntity.status(HttpStatus.OK).body("User deleted successfully");
    }
    
    @GetMapping("/current")
    @PreAuthorize("principal.username != null")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal StyleTrackUserDetails authenticatedPrincipal) {
        if (authenticatedPrincipal.user == null) return ResponseEntity.internalServerError().build();

        User user = userRepository.findById(authenticatedPrincipal.user.getId()).orElse(null);

        if (user == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(new UserDto(user.getId(), user.getUsername(), user.getEmail(), user.getDisplayName(), user.getProfilePicture()));
    }

    @PostMapping("/profileImage/upload")
    @PreAuthorize("principal.username != null")
    public ResponseEntity<UserDto> uploadImage(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal StyleTrackUserDetails authenticatedPrincipal) {
        try {
            // Check the file and user
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            var user = userRepository.findByUsername(authenticatedPrincipal.user.getUsername());
            if (user.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            // Upload image to ImageKit
            String imageUrl = imagekitService.uploadImage(file);

            // Save the image URL to the user's profile
            var userObj = user.get();
            userObj.setProfilePicture(imageUrl);
            userRepository.save(userObj);

            // Return updated user profile
            return ResponseEntity.ok(new UserDto(
                    userObj.getId(),
                    userObj.getUsername(),
                    userObj.getEmail(),
                    userObj.getDisplayName(),
                    userObj.getProfilePicture()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
