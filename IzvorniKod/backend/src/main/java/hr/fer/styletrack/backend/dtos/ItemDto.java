package hr.fer.styletrack.backend.dtos;

import java.util.Collection;

import hr.fer.styletrack.backend.entities.Item;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemDto {
    private Long sectionId;
    private Long categoryId;
    private Long itemId;
    private String itemName;
    private String description;
    private Collection<String> itemTags;

    public ItemDto(Long sectionId, Long categoryId, Long itemId, String itemName, Collection<String> itemTags, String description) {
        this.sectionId = sectionId;
        this.itemId = itemId;
        this.itemName = itemName;
        this.itemTags = itemTags;
        this.description = description;
        this.categoryId = categoryId;
    }

    public ItemDto(Item item) {
        this.sectionId = item.getSection().getSectionId();
        this.itemId = item.getItemId();
        this.itemName = item.getItemName();
        this.itemTags = item.getItemTags();
        this.description = item.getDescription();
        this.categoryId = item.getCategory().getCategoryId();
    }

    @Override
    public String toString() {
        return "{"
                + "        \"sectionId\":\"" + sectionId + "\""
                + ",         \"itemId\":\"" + itemId + "\""
                + ",         \"itemName\":\"" + itemName + "\""
                + ",         \"categoryId\":\"" + categoryId + "\""
                + ",         \"description\":\"" + description + "\""
                + ",         \"itemTags\":" + itemTags
                + "}";
    }
}
