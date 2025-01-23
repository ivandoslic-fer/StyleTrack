package hr.fer.styletrack.backend.controllers;

import hr.fer.styletrack.backend.dtos.WardrobeDetailedDto;
import hr.fer.styletrack.backend.dtos.WardrobeDto;
import hr.fer.styletrack.backend.entities.User;
import hr.fer.styletrack.backend.entities.Wardrobe;
import hr.fer.styletrack.backend.misc.StyleTrackUserDetails;
import hr.fer.styletrack.backend.repos.IUserRepository;
import hr.fer.styletrack.backend.repos.IWardrobeRepository;
import hr.fer.styletrack.backend.utils.StyleTrackConstants;
import jakarta.annotation.security.RolesAllowed;
import lombok.AllArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/api/wardrobes")
public class WardrobesController {

    private final IUserRepository userRepository;
    private final IWardrobeRepository wardrobeRepository;

    @GetMapping("/")
    public ResponseEntity<Collection<WardrobeDto>> getWardrobes(@RequestParam String username, @RequestParam Boolean forSharing, @AuthenticationPrincipal StyleTrackUserDetails authenticatedPrincipal) { // TODO: When looking for public take another param and query for all public wardrobes

        System.out.println(authenticatedPrincipal);
        System.out.println(username);
        System.out.println(forSharing);

        if (forSharing != null && forSharing && username.isEmpty()) {
            return ResponseEntity.ok(wardrobeRepository.getWardrobesByIsPublicIsTrue().stream()
                    .map(wardrobe -> new WardrobeDto(
                            wardrobe.getUser().getId(),
                            wardrobe.getWardrobeId(),
                            wardrobe.getWardrobeName(),
                            wardrobe.getDescription(),
                            wardrobe.isPublic(),
                            wardrobe.getLongitude(),
                            wardrobe.getLatitude()
                    )).collect(Collectors.toList()));
        } // You need to look if there are no wardrobes and return NOT_FOUND in that case

        if (!username.isEmpty() && forSharing != null && forSharing) {
            Optional<User> user = userRepository.findByUsername(username);

            if (user.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            return ResponseEntity.ok(user.get().getWardrobes().stream()
                    .filter(Wardrobe::isPublic)
                    .map(WardrobeDto::new).collect(Collectors.toList()));
        }

        if ((forSharing == null || !forSharing) && username.equals(authenticatedPrincipal.getUsername())) {

            Optional<User> user = userRepository.findByUsername(username);

            if (user.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            for (Wardrobe wardrobe : user.get().getWardrobes()) {
                System.out.println(wardrobe.getWardrobeName());
            }
            return ResponseEntity.ok(user.get().getWardrobes().stream()
                    .map(WardrobeDto::new).collect(Collectors.toList()));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/{wardrobeId}")
    public ResponseEntity<WardrobeDetailedDto> getWardrobeById(@PathVariable Long wardrobeId, @AuthenticationPrincipal StyleTrackUserDetails authenticatedPrincipal) {
        System.out.println("GOT INTO WARDROBE GET");
        Wardrobe wardrobe = wardrobeRepository.findById(wardrobeId).orElse(null);

        if (wardrobe == null) {
            return ResponseEntity.notFound().build();
        }

        if (!wardrobe.isPublic() && !wardrobe.getUser().getUsername().equals(authenticatedPrincipal.getUsername())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(new WardrobeDetailedDto(wardrobe));
    }

    @PostMapping("/new")
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
            if (usersWardrobeDto.getLongitude() != null) newWardrobe.setLongitude(usersWardrobeDto.getLongitude());
            if (usersWardrobeDto.getLongitude() != null) newWardrobe.setLatitude(usersWardrobeDto.getLatitude());
            newWardrobe.setDescription(usersWardrobeDto.getDescription());
            newWardrobe.setUser(userRepository.findByUsername(authenticatedPrincipal.user.getUsername()).get());

            wardrobeRepository.save(newWardrobe);

            return ResponseEntity.status(HttpStatus.CREATED).body(new WardrobeDto(newWardrobe));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/delete/{wardrobeId}")
    public ResponseEntity<String> deleteWardrobe(@PathVariable Long wardrobeId, @AuthenticationPrincipal StyleTrackUserDetails authenticatedPrincipal){

        if(!wardrobeRepository.findByWardrobeId(wardrobeId).get().getUser().getUsername().equals(authenticatedPrincipal.getUsername())){
            return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body("You cannot edit outher user's wardrobes");
        }

        if(!userRepository.findByUsername(authenticatedPrincipal.getUsername()).isPresent()) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("how");
        if(!wardrobeRepository.findByWardrobeId(wardrobeId).isPresent()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("That wardrobe doesn't exist");

        wardrobeRepository.delete(wardrobeRepository.findByWardrobeId(wardrobeId).get());
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("deleted wardrobe");
    }

    @PutMapping("/{wardrobeId}")
    public ResponseEntity<WardrobeDetailedDto> updateWardrobe(@PathVariable Long wardrobeId, @AuthenticationPrincipal StyleTrackUserDetails authenticatedPrincipal, @RequestBody WardrobeDto requestWardrobeDto) {
        Optional<Wardrobe> wardrobeOptional = wardrobeRepository.findByWardrobeId(wardrobeId);
        if (!wardrobeOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Wardrobe wardrobe = wardrobeOptional.get();

        if (!wardrobeId.equals(wardrobe.getWardrobeId())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        // Check if the authenticated user is the owner of the wardrobe
        if (!Objects.equals(wardrobe.getUser().getId(), authenticatedPrincipal.user.getId())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        wardrobe.setWardrobeName(requestWardrobeDto.getWardrobeName());
        wardrobe.setLongitude(requestWardrobeDto.getLongitude());
        wardrobe.setLatitude(requestWardrobeDto.getLatitude());
        wardrobe.setDescription(requestWardrobeDto.getDescription());
        wardrobe.setPublic(requestWardrobeDto.isPublic());

        Wardrobe updatedWardrobe = wardrobeRepository.save(wardrobe);

        WardrobeDetailedDto response = new WardrobeDetailedDto(updatedWardrobe);

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }
}
