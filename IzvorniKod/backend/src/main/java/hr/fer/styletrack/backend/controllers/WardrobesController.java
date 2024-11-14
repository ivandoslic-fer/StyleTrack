package hr.fer.styletrack.backend.controllers;

import hr.fer.styletrack.backend.dtos.WardrobeDto;
import hr.fer.styletrack.backend.entities.User;
import hr.fer.styletrack.backend.entities.Wardrobe;
import hr.fer.styletrack.backend.misc.StyleTrackUserDetails;
import hr.fer.styletrack.backend.repos.IUserRepository;
import hr.fer.styletrack.backend.repos.IWardrobeRepository;
import hr.fer.styletrack.backend.utils.StyleTrackConstants;
import jakarta.annotation.security.RolesAllowed;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/api/wardrobes")
public class WardrobesController {

    private final IUserRepository userRepository;
    private final IWardrobeRepository wardrobeRepository;

    @GetMapping("/")
    public ResponseEntity<Collection<WardrobeDto>> getWardrobes(@RequestParam String username, @RequestParam Optional<Boolean> forSharing, @AuthenticationPrincipal StyleTrackUserDetails authenticatedPrincipal) { // TODO: When looking for public take another param and query for all public wardrobes

        if (forSharing.isPresent() && forSharing.get()) {
            return ResponseEntity.ok(wardrobeRepository.getWardrobesByIsPublicIsTrue().stream()
                    .map(wardrobe -> new WardrobeDto(
                            wardrobe.getUser().getId(),
                            wardrobe.getWardrobeId(),
                            wardrobe.getWardrobeName(),
                            new ArrayList<>()
                    )).collect(Collectors.toList()));
        } // You need to look if there are no wardrobes and return NOT_FOUND in that case

        if (!username.equals(authenticatedPrincipal.user.getUsername())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get().getWardrobes().stream()
                    .map(wardrobe -> new WardrobeDto(
                            user.get().getId(),
                            wardrobe.getWardrobeId(),
                            wardrobe.getWardrobeName(),
                            new ArrayList<>() // temporary
                            // wardrobe.getTags()
                    )).collect(Collectors.toList())
            );
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{wardrobeId}")
    public ResponseEntity<WardrobeDto> getWardrobeById(@PathVariable Long wardrobeId, @AuthenticationPrincipal StyleTrackUserDetails authenticatedPrincipal) {
        Wardrobe wardrobe = wardrobeRepository.findById(wardrobeId).orElse(null);

        if (wardrobe == null) {
            return ResponseEntity.notFound().build();
        }

        if (!wardrobe.isPublic() && !wardrobe.getUser().getUsername().equals(authenticatedPrincipal.getUsername())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(new WardrobeDto(wardrobe));
    }

    @PostMapping("/new")
    @RolesAllowed(StyleTrackConstants.PERSONAL_USER_ROLE)
    @PreAuthorize("#usersWardrobeDto.ownerId == principal.user.id")
    public ResponseEntity<WardrobeDto> addNewWardrobe(@RequestBody WardrobeDto usersWardrobeDto, @AuthenticationPrincipal StyleTrackUserDetails authenticatedPrincipal){
        if (authenticatedPrincipal == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        if (!usersWardrobeDto.getOwnerId().equals(authenticatedPrincipal.user.getId())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            Wardrobe newWardrobe = new Wardrobe();
            newWardrobe.setWardrobeName(usersWardrobeDto.getWardrobeName());
            newWardrobe.setPublic(false);
            // newWardrobe.setTags(usersWardrobeDto.getTags());
            newWardrobe.setUser(userRepository.findByUsername(authenticatedPrincipal.user.getUsername()).get());

            wardrobeRepository.save(newWardrobe);

            return ResponseEntity.status(HttpStatus.CREATED).body(new WardrobeDto(newWardrobe));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/delete/{wardrobeId}")
    @RolesAllowed(StyleTrackConstants.PERSONAL_USER_ROLE)
    public ResponseEntity<String> deleteWardrobe(@PathVariable Long wardrobeId, @AuthenticationPrincipal StyleTrackUserDetails authenticatedPrincipal){

        if(!wardrobeRepository.findByWardrobeId(wardrobeId).get().getUser().getUsername().equals(authenticatedPrincipal.getUsername())){
            return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body("You cannot edit outher user's wardrobes");
        }

        if(!userRepository.findByUsername(authenticatedPrincipal.getUsername()).isPresent()) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("how");
        if(!wardrobeRepository.findByWardrobeId(wardrobeId).isPresent()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("That wardrobe doesn't exist");

        wardrobeRepository.delete(wardrobeRepository.findByWardrobeId(wardrobeId).get());
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("deleted wardrobe");
    }

    // Potentially we'll need to add PUT method for updating tags when added but for now updating is not needed
}
