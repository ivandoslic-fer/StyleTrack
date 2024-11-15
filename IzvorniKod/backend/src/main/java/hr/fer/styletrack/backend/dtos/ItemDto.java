package hr.fer.styletrack.backend.dtos;

import java.util.Collection;

import hr.fer.styletrack.backend.entities.Item;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemDto {
    private Long sectionId;
    private Long itemId;
    private String itemName;
    private String category;
    private String description;
    private Collection<String> itemTags;

    public ItemDto(Long sectionId, Long itemId, String itemName, Collection<String> itemTags, String description, String category) {
        this.sectionId = sectionId;
        this.itemId = itemId;
        this.itemName = itemName;
        this.itemTags = itemTags;
        this.description = description;
        this.category = category;
    }

    public ItemDto(Item item) {
        this.sectionId = item.getSection().getSectionId();
        this.itemId = item.getItemId();
        this.itemName = item.getItemName();
        this.itemTags = item.getItemTags();
        this.description = item.getDescription();
        this.category = item.getCategory();
    }

    @Override
    public String toString() {
        return "{"
                + "        \"sectionId\":\"" + sectionId + "\""
                + ",         \"itemId\":\"" + itemId + "\""
                + ",         \"itemName\":\"" + itemName + "\""
                + ",         \"categoryName\":\"" + category + "\""
                + ",         \"description\":\"" + description + "\""
                + ",         \"itemTags\":" + itemTags
                + "}";
    }
}
