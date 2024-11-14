package hr.fer.styletrack.backend.controllers;

import hr.fer.styletrack.backend.dtos.ItemDto;
import hr.fer.styletrack.backend.dtos.SectionDto;
import hr.fer.styletrack.backend.dtos.UserDto;
import hr.fer.styletrack.backend.dtos.WardrobeDto;
import hr.fer.styletrack.backend.entities.Section;
import hr.fer.styletrack.backend.entities.User;
import hr.fer.styletrack.backend.entities.Wardrobe;
import hr.fer.styletrack.backend.repos.IItemRepository;
import hr.fer.styletrack.backend.repos.ISectionRepository;
import hr.fer.styletrack.backend.repos.IUserRepository;
import hr.fer.styletrack.backend.repos.IWardrobeRepository;
import hr.fer.styletrack.backend.utils.StyleTrackConstants;
import jakarta.annotation.security.RolesAllowed;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@AllArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/api/users")
public class UsersController {

    private final IUserRepository userRepository;
    private final IWardrobeRepository wardrobeRepository;
    private final ISectionRepository sectionRepository;
    private final IItemRepository itemRepository;

    @GetMapping("/")
    public ResponseEntity<List<UserDto>> getUsers() {
        List<User> users = userRepository.findAll();
        List<UserDto> userDtos = users.stream().map(user -> new UserDto(user.getId(), user.getUsername(), user.getEmail())).toList();
        return ResponseEntity.ok(userDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(new UserDto(user.get().getId(), user.get().getUsername(), user.get().getEmail()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserDto> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userRepository.findByUsername(username); // Assuming this method exists in the repository
        return user.map(value -> ResponseEntity.ok(new UserDto(value.getId(), value.getUsername(), value.getEmail())))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @RolesAllowed(StyleTrackConstants.PERSONAL_USER_ROLE)
    @PreAuthorize("#id == principal.user.id") // Ovako provjeravati je li korisnik onaj za kojeg se predstavlja da je
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
        Optional<User> user = userRepository.findById(id);

        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        user.get().setEmail(userDto.getEmail());

        userRepository.save(user.get());

        if (user.isPresent()) {
            return ResponseEntity.ok(new UserDto(user.get().getId(), user.get().getUsername(), user.get().getEmail()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
