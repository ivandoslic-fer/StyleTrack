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
    private Collection<String> itemTags;

    public ItemDto(Long sectionId, Long itemId, String itemName, Collection<String> itemTags){
        this.sectionId = sectionId;
        this.itemId = itemId;
        this.itemName = itemName;
        this.itemTags = itemTags;
    }

    public ItemDto(Item item) {
        this.sectionId = item.getSection().getSectionId();
        this.itemId = item.getItemId();
        this.itemName = item.getItemName();
        this.itemTags = item.getItemTags();
    }

    @Override
    public String toString() {
        return "{"
                + "        \"itemId\":\"" + itemId + "\""
                + ",         \"itemName\":\"" + itemName + "\""
                + ",         \"itemTags\":" + itemTags
                + "}";
    }
}
