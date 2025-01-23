package hr.fer.styletrack.backend.dtos;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import hr.fer.styletrack.backend.entities.Item;
import hr.fer.styletrack.backend.entities.ItemGallery;
import hr.fer.styletrack.backend.entities.Tag;
import hr.fer.styletrack.backend.entities.itemcategories.BaseCategory;
import hr.fer.styletrack.backend.entities.itemcategories.ClothesCategory;
import hr.fer.styletrack.backend.entities.itemcategories.FootwearCategory;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

@Getter
@Setter
public class ItemDto {
    private Long sectionId;
    private Long itemId;
    private String itemName;
    private String category;
    private String description;
    private String seasonCategory;
    private String brand;
    private boolean forSharing;
    private String mainImageUrl;
    private Set<String> itemTags;
    private Map<String, Object> categoryFields;
    private Set<String> galleryImages;

    private String itemUrl;

    public ItemDto(Long sectionId, Long itemId, String itemName, Set<String> itemTags, String description,
                   String category, String seasonCategory, String brand, String mainImageUrl, Map<String, Object> categoryFields,
                   Set<String> galleryImages, boolean forSharing) {
        this.sectionId = sectionId;
        this.itemId = itemId;
        this.itemName = itemName;
        this.itemTags = itemTags;
        this.description = description;
        this.category = category;
        this.seasonCategory = seasonCategory;
        this.brand = brand;
        this.mainImageUrl = mainImageUrl;
        this.categoryFields = categoryFields;
        this.forSharing = false;
        this.galleryImages = galleryImages;
    }

    public ItemDto(Item item) {
        this.sectionId = item.getSection().getSectionId();
        this.itemId = item.getItemId();
        this.itemName = item.getItemName();
        this.itemTags = item.getTags().stream().map(Tag::getTagName).collect(Collectors.toSet());
        this.description = item.getDescription();
        this.category = getCategoryName(item.getCategory());
        this.seasonCategory = item.getSeasonCategory();
        this.brand = item.getBrand();
        this.mainImageUrl = item.getMainImageUrl();
        this.categoryFields = generateCategoryFields(item.getCategory());
        this.galleryImages = item.getGallery().stream()
                .map(ItemGallery::getImageUrl)
                .collect(Collectors.toSet());
        this.forSharing = item.isForSharing();
    }

    public String getCategoryName(BaseCategory category) {
        BaseCategory actualCategory = (BaseCategory) Hibernate.unproxy(category);

        if (actualCategory instanceof ClothesCategory) return "CLOTHES";
        else if (actualCategory instanceof FootwearCategory) return "FOOTWEAR";
        else return "OTHER";
    }

    public Map<String, Object> generateCategoryFields(BaseCategory category) {
        Map<String, Object> categoryFields = new HashMap<>();

        BaseCategory actualCategory = (BaseCategory) Hibernate.unproxy(category);

        if (actualCategory instanceof ClothesCategory clothesCategory) {
            categoryFields.put("fabric", clothesCategory.getFabric());
            categoryFields.put("size", clothesCategory.getSize());
            categoryFields.put("longSleeved", clothesCategory.isLongSleeved());
        } else if (actualCategory instanceof FootwearCategory footwearCategory) {
            categoryFields.put("shoeSize", footwearCategory.getShoeSize());
            categoryFields.put("openFoot", footwearCategory.isOpenFoot());
            categoryFields.put("highHeeled", footwearCategory.isHighHeeled());
            categoryFields.put("material", footwearCategory.getMaterial());
            categoryFields.put("highShoes", footwearCategory.isHighShoes());
        } else {
            throw new IllegalArgumentException("Unsupported category type: " + category.getClass().getSimpleName());
        }

        return categoryFields;
    }


    @Override
    public String toString() {
        return "{"
                + "        \"sectionId\":\"" + sectionId + "\""
                + ",         \"itemId\":\"" + itemId + "\""
                + ",         \"itemName\":\"" + itemName + "\""
                + ",         \"categoryName\":\"" + category + "\""
                + ",         \"description\":\"" + description + "\""
                + ",         \"seasonCategory\":\"" + seasonCategory + "\""
                + ",         \"brand\":\"" + brand + "\""
                + ",         \"mainImageUrl\":\"" + mainImageUrl + "\""
                + ",         \"itemTags\":" + itemTags
                + ",         \"galleryImages\":" + galleryImages
                + "}";
    }
}
