package hr.fer.styletrack.backend.controllers;

import hr.fer.styletrack.backend.dtos.FeedItemDto;
import hr.fer.styletrack.backend.dtos.ItemDto;
import hr.fer.styletrack.backend.entities.Item;
import hr.fer.styletrack.backend.entities.Section;
import hr.fer.styletrack.backend.entities.User;
import hr.fer.styletrack.backend.entities.Wardrobe;
import hr.fer.styletrack.backend.misc.StyleTrackUserDetails;
import hr.fer.styletrack.backend.repos.IItemRepository;
import hr.fer.styletrack.backend.repos.ISectionRepository;
import hr.fer.styletrack.backend.repos.IUserRepository;
import hr.fer.styletrack.backend.repos.IWardrobeRepository;
import hr.fer.styletrack.backend.services.ImagekitService;
import hr.fer.styletrack.backend.services.ItemService;
import hr.fer.styletrack.backend.utils.StyleTrackConstants;
import jakarta.annotation.security.RolesAllowed;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/api/items")
public class ItemsController {
    private final ISectionRepository sectionRepository;
    private final IItemRepository itemRepository;
    private final ImagekitService imagekitService;
    private final ItemService itemService;

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

    @GetMapping("/search")
    public ResponseEntity<List<ItemDto>> searchItems(
            @RequestParam(required = false) String itemName,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String seasonCategory,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String tags,
            @RequestParam(required = false) String category,
            @RequestParam Map<String, String> categoryFilters) {

        List<String> tagList = (tags != null) ? Arrays.asList(tags.split(",")) : null;

        categoryFilters.remove("itemName");
        categoryFilters.remove("description");
        categoryFilters.remove("seasonCategory");
        categoryFilters.remove("brand");
        categoryFilters.remove("tags");
        categoryFilters.remove("category");

        List<Item> items = itemService.searchItems(itemName, description, seasonCategory, brand, tagList, category, categoryFilters);

        if (items.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        List<ItemDto> result = items.stream().map(ItemDto::new).toList();

        for (Item item : items) {
            for (ItemDto dto : result) {
                if (Double.compare(item.getItemId(), dto.getItemId()) == 0) {
                    dto.setItemUrl("/wardrobes/" + item.getSection().getWardrobe().getWardrobeId() + "/" + item.getSection().getSectionId() + "/item/" + item.getItemId());
                }
            }
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/feed")
    public ResponseEntity<List<FeedItemDto>> getFeedItems() {
        List<Item> items = itemService.getItemsFromPublicWardrobes();
        List<FeedItemDto> feedItems = items.stream().map(item -> {
            User owner = item.getSection().getWardrobe().getUser();
            return new FeedItemDto(
                    item.getItemId(),
                    item.getItemName(),
                    item.getDescription(),
                    item.getBrand(),
                    item.getSeasonCategory(),
                    item.isForSharing(),
                    item.getMainImageUrl(),
                    owner.getDisplayName(),
                    owner.getProfilePicture(),
                    owner.isAdvertiser()
            );
        }).toList();

        return ResponseEntity.ok(feedItems);
    }


    @PostMapping("/new")
    @RolesAllowed(StyleTrackConstants.PERSONAL_USER_ROLE)
    public ResponseEntity<Item> createNewItem(@RequestBody ItemDto itemDto, @AuthenticationPrincipal StyleTrackUserDetails authenticatedPrincipal) {
        try {
            Item createdItem = itemService.createItem(itemDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdItem);
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
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

    @PostMapping("/uploadImage")
    @PreAuthorize("principal.username != null")
    public ResponseEntity<String> uploadImage(MultipartFile file, @AuthenticationPrincipal StyleTrackUserDetails authenticatedPrincipal) {
        try {
            if (file.isEmpty()) return ResponseEntity.badRequest().build();

            String imageUrl = imagekitService.uploadImage(file);

            return ResponseEntity.ok(imageUrl);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
