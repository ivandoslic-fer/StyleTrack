package hr.fer.styletrack.backend.services;

import hr.fer.styletrack.backend.dtos.ItemDto;
import hr.fer.styletrack.backend.entities.Item;
import hr.fer.styletrack.backend.entities.ItemGallery;
import hr.fer.styletrack.backend.entities.Section;
import hr.fer.styletrack.backend.entities.Tag;
import hr.fer.styletrack.backend.entities.itemcategories.BaseCategory;
import hr.fer.styletrack.backend.entities.itemcategories.ClothesCategory;
import hr.fer.styletrack.backend.entities.itemcategories.FootwearCategory;
import hr.fer.styletrack.backend.misc.ItemSpecifications;
import hr.fer.styletrack.backend.repos.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ItemService {

    @Autowired
    private ISectionRepository sectionRepository;

    @Autowired
    private IBaseCategoryRepository categoryRepository;

    @Autowired
    private IItemRepository itemRepository;

    @Autowired
    private ITagRepository tagRepository;

    @Autowired
    private IGalleryRepository galleryRepository;

    @Autowired
    private EntityManager entityManager;

    public Item createItem(ItemDto itemDto) {
        // Validate and fetch the section
        Section section = sectionRepository.findById(itemDto.getSectionId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid section ID"));

        // Populate category-specific fields
        BaseCategory category = populateCategoryFields(itemDto.getCategory(), itemDto.getCategoryFields());

        category = categoryRepository.save(category);

        // Create the item
        Item newItem = new Item();
        newItem.setSection(section);
        newItem.setItemName(itemDto.getItemName());
        newItem.setForSharing(false);
        newItem.setDescription(itemDto.getDescription());
        newItem.setSeasonCategory(itemDto.getSeasonCategory());
        newItem.setBrand(itemDto.getBrand());
        newItem.setCategory(category);

        if (!itemDto.getGalleryImages().isEmpty()) newItem.setMainImageUrl(itemDto.getGalleryImages().iterator().next());

        newItem = itemRepository.save(newItem);

        final Item persistedItem = newItem;

        // Handle optional tags
        if (itemDto.getItemTags() != null) {
            Set<Tag> tags = itemDto.getItemTags().stream()
                    .map(tagName -> tagRepository.getTagByTagName(tagName)
                            .orElseGet(() -> {
                                Tag newTag = new Tag();
                                newTag.setTagName(tagName);
                                tagRepository.save(newTag);
                                return newTag;
                            }))
                    .collect(Collectors.toSet());
            persistedItem.setTags(tags);
        }

        // Handle optional gallery images
        if (itemDto.getGalleryImages() != null) {
            itemDto.getGalleryImages().forEach(imageUrl -> {
                ItemGallery gallery = new ItemGallery();
                gallery.setImageUrl(imageUrl);
                persistedItem.addGalleryImage(gallery); // Use helper method
            });
        }

        newItem = itemRepository.save(persistedItem);
        return newItem;
    }

    private BaseCategory populateCategoryFields(String categoryType, Map<String, Object> categoryFields) {
        if (categoryFields == null || categoryFields.isEmpty()) {
            throw new IllegalArgumentException("Category-specific fields are required.");
        }

        switch (categoryType) {
            case "CLOTHES":
                ClothesCategory clothesCategory = new ClothesCategory();
                clothesCategory.setFabric((String) categoryFields.get("fabric"));
                clothesCategory.setSize((String) categoryFields.get("size"));
                clothesCategory.setLongSleeved((Boolean) categoryFields.getOrDefault("longSleeved", false));
                return clothesCategory;

            case "FOOTWEAR":
                FootwearCategory footwearCategory = new FootwearCategory();
                footwearCategory.setShoeSize((String) categoryFields.get("shoeSize"));
                footwearCategory.setOpenFoot((Boolean) categoryFields.getOrDefault("openFoot", false));
                footwearCategory.setHighHeeled((Boolean) categoryFields.getOrDefault("highHeeled", false));
                footwearCategory.setMaterial((String) categoryFields.get("material"));
                footwearCategory.setHighShoes((Boolean) categoryFields.getOrDefault("highShoes", false));
                return footwearCategory;

            default:
                throw new IllegalArgumentException("Unsupported category type: " + categoryType);
        }
    }

    public List<Item> searchItems(String itemName, String description, String seasonCategory, String brand, List<String> tags, String category, Map<String, String> categoryFilters) {
        Specification<Item> spec = ItemSpecifications.byFilters(itemName, description, seasonCategory, brand, tags, category, categoryFilters);
        return itemRepository.findAll(spec);
    }

    public List<Item> getItemsFromPublicWardrobes() {
        return itemRepository.findItemsInPublicWardrobes();
    }
}
