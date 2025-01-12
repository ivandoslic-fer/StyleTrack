package hr.fer.styletrack.backend.controllers;

import hr.fer.styletrack.backend.dtos.ItemDto;
import hr.fer.styletrack.backend.entities.Item;
import hr.fer.styletrack.backend.entities.Section;
import hr.fer.styletrack.backend.entities.User;
import hr.fer.styletrack.backend.entities.Wardrobe;
import hr.fer.styletrack.backend.misc.StyleTrackUserDetails;
import hr.fer.styletrack.backend.repos.ICategoryRepository;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/api/items")
public class ItemsController {
    private final ICategoryRepository categoryRepository;
    private final ISectionRepository sectionRepository;
    private final IItemRepository itemRepository;

    @GetMapping("/")
    public ResponseEntity<Collection<ItemDto>> getItemsFromSection(@RequestParam Long sectionId, @AuthenticationPrincipal StyleTrackUserDetails authenticatedPrincipal){
        try {
            Optional<Section> section = sectionRepository.findById(sectionId);
            if (section.isPresent()) {
                if (section.get().getWardrobe().isPublic() || section.get().getWardrobe().getUser().getUsername().equals(authenticatedPrincipal.getUsername())) {
                    return ResponseEntity.ok(section.get().getItems().stream()
                            .map(ItemDto::new).collect(Collectors.toList()));
                } else {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
                }
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{itemId}")
    public ResponseEntity<ItemDto> getItemById(@PathVariable Long itemId, @AuthenticationPrincipal StyleTrackUserDetails authenticatedPrincipal){
        try {
            Optional<Item> item = itemRepository.findById(itemId);

            if (item.isPresent()) {
                if (item.get().getSection().getWardrobe().isPublic() || item.get().getSection().getWardrobe().getUser().getUsername().equals(authenticatedPrincipal.getUsername())) {
                    return ResponseEntity.ok(new ItemDto(item.get()));
                } else {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
                }
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/new")
    @RolesAllowed(StyleTrackConstants.PERSONAL_USER_ROLE)
    public ResponseEntity<ItemDto> createNewItem(@RequestBody ItemDto itemDto, @AuthenticationPrincipal StyleTrackUserDetails authenticatedPrincipal) {
        Section parentSection = sectionRepository.findById(itemDto.getSectionId()).orElse(null);

        if (parentSection == null) {
            return ResponseEntity.badRequest().build();
        }

        if (parentSection.getWardrobe().getUser().getUsername().equals(authenticatedPrincipal.getUsername())) {
            try {
                Item newItem = new Item();
                newItem.setItemName(itemDto.getItemName());
                newItem.setItemTags(itemDto.getItemTags());
                newItem.setCategory(categoryRepository.findById(itemDto.getCategoryId()).orElse(null));
                newItem.setDescription(itemDto.getDescription());
                newItem.setSection(parentSection);
                itemRepository.save(newItem);
                return ResponseEntity.ok(new ItemDto(newItem));
            } catch (Exception e) {
                return ResponseEntity.internalServerError().build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @DeleteMapping("/delete/{itemId}")
    @RolesAllowed(StyleTrackConstants.PERSONAL_USER_ROLE)
    public ResponseEntity<String> removeItemFromSection(@PathVariable Long itemId, @AuthenticationPrincipal StyleTrackUserDetails authenticatedPrincipal) {
        Item item = itemRepository.findById(itemId).orElse(null);
        if (item == null) {
            return ResponseEntity.notFound().build();
        }

        if (!item.getSection().getWardrobe().getUser().getUsername().equals(authenticatedPrincipal.getUsername())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            itemRepository.delete(item);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("removed requested item from section");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Add updating all the items
}
