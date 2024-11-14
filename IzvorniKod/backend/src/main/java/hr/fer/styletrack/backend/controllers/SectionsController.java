package hr.fer.styletrack.backend.controllers;

import hr.fer.styletrack.backend.dtos.SectionDto;
import hr.fer.styletrack.backend.entities.Section;
import hr.fer.styletrack.backend.entities.User;
import hr.fer.styletrack.backend.entities.Wardrobe;
import hr.fer.styletrack.backend.misc.StyleTrackUserDetails;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/api/sections")
public class SectionsController {
    private final IWardrobeRepository wardrobeRepository;
    private final ISectionRepository sectionRepository;

    @GetMapping("/")
    public ResponseEntity<Collection<SectionDto>> getSectionsForWardrobe(@RequestParam Long wardrobeId, @AuthenticationPrincipal StyleTrackUserDetails authenticatedPrincipal) {
        Wardrobe wardrobe = wardrobeRepository.findById(wardrobeId).orElse(null);

        if (wardrobe == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (!wardrobe.isPublic() && !wardrobe.getUser().getUsername().equals(authenticatedPrincipal.getUsername())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        return ResponseEntity.ok(wardrobe.getSections().stream()
                .map(section -> new SectionDto(
                        section.getWardrobe().getWardrobeId(),
                        section.getSectionId(),
                        section.getSectionName()
                )).collect(Collectors.toList()));
    }

    @GetMapping("/{sectionId}")
    public ResponseEntity<SectionDto> getSectionById(@PathVariable Long sectionId, @AuthenticationPrincipal StyleTrackUserDetails authenticatedPrincipal) {
        Section section = sectionRepository.findById(sectionId).orElse(null);

        if (section == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (!section.getWardrobe().isPublic() && !section.getWardrobe().getUser().getUsername().equals(authenticatedPrincipal.getUsername())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        return ResponseEntity.ok(new SectionDto(section));
    }

    @PostMapping("/new")
    @RolesAllowed(StyleTrackConstants.PERSONAL_USER_ROLE)
    public ResponseEntity<SectionDto> addNewSection(@RequestBody SectionDto usersSectionDto, @AuthenticationPrincipal StyleTrackUserDetails authenticatedPrincipal) {
        if(!wardrobeRepository.findByWardrobeId(usersSectionDto.getWardrobeId()).get().getUser().getUsername().equals(authenticatedPrincipal.user.getUsername())){
            return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).build();
        }

        try {
            Section newSection = new Section();
            newSection.setSectionName(usersSectionDto.getSectionName());
            newSection.setWardrobe(wardrobeRepository.findByWardrobeId(usersSectionDto.getSectionId()).get());
            sectionRepository.save(newSection);
            return ResponseEntity.status(HttpStatus.CREATED).body(new SectionDto(newSection));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/delete/{sectionId}")
    @RolesAllowed(StyleTrackConstants.PERSONAL_USER_ROLE)
    public ResponseEntity<String> deleteSection(@PathVariable Long sectionId, @AuthenticationPrincipal StyleTrackUserDetails authenticatedPrincipal) {
        Wardrobe wardrobe = sectionRepository.findBySectionId(sectionId).get().getWardrobe();
        if(!(wardrobe.getUser().getUsername().equals(authenticatedPrincipal.user.getUsername()))){
            return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body("You cannot edit outher user's sections");
        }

        try {
            sectionRepository.delete(sectionRepository.findBySectionId(sectionId).get());
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("deleted section");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("how");
        }
    }

    // Add update for section when needed
}
