package hr.fer.styletrack.backend.dtos;

import java.util.ArrayList;
import java.util.Collection;

import hr.fer.styletrack.backend.entities.Wardrobe;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WardrobeDto {
    private Long ownerId;
    private Long wardrobeId;
    private String wardrobeName;
    private Collection<String> tags;

    public WardrobeDto(Long ownerId, Long wardrobeId, String wardrobeName, Collection<String> tags) {
        this.ownerId = ownerId;
        this.wardrobeId = wardrobeId;
        this.wardrobeName = wardrobeName;
        this.tags = tags;
    }

    public WardrobeDto(Wardrobe newWardrobe) {
        this.ownerId = newWardrobe.getUser().getId();
        this.wardrobeId = newWardrobe.getWardrobeId();
        this.wardrobeName = newWardrobe.getWardrobeName();
        this.tags = new ArrayList<>();
    }

    @Override
    public String toString() {
        return "{"
                + "        \"ownerId\":\"" + ownerId + "\""
                + ",         \"wardrobeId\":\"" + wardrobeId + "\""
                + ",         \"wardrobeName\":\"" + wardrobeName + "\""
                + ",         \"tags\":" + tags
                + "}";
    }
}