package hr.fer.styletrack.backend.dtos;

import java.util.Collection;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemDto {
    private Long itemId;
    private String itemName;
    private Collection<String> itemTags;

    public ItemDto(Long itemId, String itemName, Collection<String> itemTags){ 
        this.itemId = itemId;
        this.itemName = itemName;
        this.itemTags = itemTags;
    }
}
