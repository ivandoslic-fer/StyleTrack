package hr.fer.styletrack.backend.dtos;

import hr.fer.styletrack.backend.entities.Section;
import hr.fer.styletrack.backend.entities.Wardrobe;
import lombok.Getter;
import lombok.Setter;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class WardrobeDetailedDto extends WardrobeDto {
    List<SectionDto> sections;

    public WardrobeDetailedDto(Long ownerId, Long wardrobeId, String wardrobeName, String description, boolean isPublic, Double longitude, Double latitude, List<Section> sections) {
        super(ownerId, wardrobeId, wardrobeName, description, isPublic, longitude, latitude);
        this.sections = sections.stream().map(SectionDto::new).toList();
    }

    public WardrobeDetailedDto(Wardrobe newWardrobe) {
        super(newWardrobe);
        this.sections = newWardrobe.getSections().stream().map(SectionDto::new).toList();
    }
}
