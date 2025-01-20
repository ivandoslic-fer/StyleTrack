package hr.fer.styletrack.backend.controllers;

import hr.fer.styletrack.backend.dtos.CreateOutfitDto;
import hr.fer.styletrack.backend.dtos.DetailedOutfitDto;
import hr.fer.styletrack.backend.dtos.ItemDto;
import hr.fer.styletrack.backend.dtos.OutfitDto;
import hr.fer.styletrack.backend.entities.Item;
import hr.fer.styletrack.backend.entities.Outfit;
import hr.fer.styletrack.backend.entities.Tag;
import hr.fer.styletrack.backend.entities.User;
import hr.fer.styletrack.backend.misc.StyleTrackUserDetails;
import hr.fer.styletrack.backend.repos.IItemRepository;
import hr.fer.styletrack.backend.repos.IOutfitRepository;
import hr.fer.styletrack.backend.repos.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/outfits")
@RequiredArgsConstructor
public class OutfitsController {

    @Autowired
    private final IOutfitRepository outfitRepository;
    @Autowired
    private final IItemRepository itemRepository;
    @Autowired
    private final IUserRepository userRepository;

    @GetMapping("/")
    public ResponseEntity<List<OutfitDto>> getAllOutfits() {
        var outfits = outfitRepository.findAll();

        if (outfits.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return ResponseEntity.ok(outfits.stream().map(otfit -> new OutfitDto(
                otfit.getId(),
                otfit.getName(),
                otfit.getSeason(),
                otfit.isForRain(),
                otfit.isForSnow(),
                otfit.isForWinter(),
                otfit.isForSummer(),
                otfit.isForAutumnSpring(),
                otfit.getItems().stream().map(Item::getItemId).collect(Collectors.toSet()),
                otfit.getUser().getId()
        )).toList());
    }

    @GetMapping("/my")
    public ResponseEntity<List<OutfitDto>> getMyOutfits(
            @AuthenticationPrincipal StyleTrackUserDetails authenticatedPrincipal) {
        if (authenticatedPrincipal == null) {
            return ResponseEntity.noContent().build();
        }

        var outfits = outfitRepository.findAll().stream()
                .filter(outfit -> outfit.getUser().getUsername().equals(authenticatedPrincipal.getUsername()))
                .map(otfit -> new OutfitDto(
                        otfit.getId(),
                        otfit.getName(),
                        otfit.getSeason(),
                        otfit.isForRain(),
                        otfit.isForSnow(),
                        otfit.isForWinter(),
                        otfit.isForSummer(),
                        otfit.isForAutumnSpring(),
                        otfit.getItems().stream().map(Item::getItemId).collect(Collectors.toSet()),
                        otfit.getUser().getId()
                ))
                .toList();

        if (outfits.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(outfits);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetailedOutfitDto> getOutfitById(@PathVariable Long id) {
        var outfit = outfitRepository.findOutfitById(id);

        if (outfit.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        var otfit = outfit.get();

        return ResponseEntity.ok(new DetailedOutfitDto(
                otfit.getId(),
                otfit.getName(),
                otfit.getSeason(),
                otfit.isForRain(),
                otfit.isForSnow(),
                otfit.isForWinter(),
                otfit.isForSummer(),
                otfit.isForAutumnSpring(),
                otfit.getUser().getId(),
                otfit.getItems().stream().map(ItemDto::new).toList()
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOutfitById(@PathVariable Long id) {
        var outfit = outfitRepository.findOutfitById(id);
        if (outfit.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        outfitRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/create")
    public ResponseEntity<String> createOutfit(
            @RequestBody CreateOutfitDto createOutfitDto,
            @AuthenticationPrincipal StyleTrackUserDetails authenticatedUser) {

        try {
            // Fetch the authenticated user
            Optional<User> user = userRepository.findByUsername(authenticatedUser.getUsername());

            if (user.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            System.out.println(createOutfitDto);

            // Fetch items based on item IDs and validate ownership
            List<Item> items = itemRepository.findAllById(createOutfitDto.getItemIds())
                    .stream()
                    .filter(item -> item.getSection().getWardrobe().getUser().getId().equals(user.get().getId()))
                    .toList();

            if (items.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No valid items found for the outfit.");
            }

            // Create a new Outfit entity
            Outfit outfit = new Outfit();
            outfit.setName(createOutfitDto.getName());
            outfit.setForRain(createOutfitDto.isForRain());
            outfit.setForSnow(createOutfitDto.isForSnow());
            outfit.setForWinter(createOutfitDto.isForWinter());
            outfit.setForSummer(createOutfitDto.isForSummer());
            outfit.setForAutumnSpring(createOutfitDto.isForAutumnSpring());
            outfit.setItems(new HashSet<>(items));
            outfit.setUser(user.get());

            // Save the outfit
            outfitRepository.save(outfit);

            return ResponseEntity.status(HttpStatus.CREATED).body("Outfit created successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create outfit.");
        }
    }
}
