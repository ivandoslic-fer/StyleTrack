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
    private String description;
    private boolean isPublic;
    private Double longitude;
    private Double latitude;

    public WardrobeDto(Long ownerId, Long wardrobeId, String wardrobeName, String description, boolean isPublic, Double longitude, Double latitude) {
        this.ownerId = ownerId;
        this.wardrobeId = wardrobeId;
        this.wardrobeName = wardrobeName;
        this.description = description;
        this.isPublic = isPublic;
        this.longitude = longitude;
        this.latitude = latitude;

    }

    public WardrobeDto(Wardrobe newWardrobe) {
        this.ownerId = newWardrobe.getUser().getId();
        this.wardrobeId = newWardrobe.getWardrobeId();
        this.wardrobeName = newWardrobe.getWardrobeName();
        this.description = newWardrobe.getDescription();
        this.isPublic = newWardrobe.isPublic();
        this.longitude = newWardrobe.getLongitude();
        this.latitude = newWardrobe.getLatitude();
    }

    @Override
    public String toString() {
        return "{"
                + "        \"ownerId\":\"" + ownerId + "\""
                + ",         \"wardrobeId\":\"" + wardrobeId + "\""
                + ",         \"wardrobeName\":\"" + wardrobeName + "\""
                + ",         \"description\":\"" + description + "\""
                + ",         \"isPublic\":\"" + isPublic + "\""
                + ",         \"longitude\":\"" + longitude + "\""
                + ",         \"latitude\":\"" + latitude + "\""
                + "}";
    }
}