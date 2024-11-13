package hr.fer.styletrack.backend.dtos;

import java.util.Collection;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WardrobeDto {
    private Long wardrobeId;
    private String wardrobeName;
    private Collection<String> tags;

    public WardrobeDto(Long wardrobeId, String wardrobeName, Collection<String> tags) {
        this.wardrobeId = wardrobeId;
        this.wardrobeName = wardrobeName;
        this.tags = tags;
    }
}