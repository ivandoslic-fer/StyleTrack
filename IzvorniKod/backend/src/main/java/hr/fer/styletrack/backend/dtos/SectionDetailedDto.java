package hr.fer.styletrack.backend.dtos;

import hr.fer.styletrack.backend.entities.Item;
import hr.fer.styletrack.backend.entities.Section;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SectionDetailedDto extends SectionDto {
    List<ItemDto> items;

    public SectionDetailedDto(Long wardrobeId, Long sectionId, String sectionName, String sectionType, int sectionCapacity, List<Item> items) {
        super(wardrobeId, sectionId, sectionName, sectionType, sectionCapacity);
        this.items = items.stream().map(ItemDto::new).toList();
    }

    public SectionDetailedDto(Section newSection) {
        super(newSection);
        this.items = newSection.getItems().stream().map(ItemDto::new).toList();
    }
}
