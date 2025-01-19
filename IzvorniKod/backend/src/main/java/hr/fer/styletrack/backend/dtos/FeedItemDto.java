package hr.fer.styletrack.backend.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FeedItemDto {
    private Long itemId;
    private String itemName;
    private String description;
    private String brand;
    private String seasonCategory;
    private boolean forSharing;
    private String mainImageUrl;
    private String ownerDisplayName;
    private String ownerUsername;
    private String ownerProfilePicture;
    private boolean isAdvertiser;

    public FeedItemDto(Long itemId, String itemName, String description, String brand, String seasonCategory,
                       boolean forSharing, String mainImageUrl, String ownerDisplayName, String ownerUsername,
                       String ownerProfilePicture, boolean isAdvertiser) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.description = description;
        this.brand = brand;
        this.seasonCategory = seasonCategory;
        this.forSharing = forSharing;
        this.mainImageUrl = mainImageUrl;
        this.ownerDisplayName = ownerDisplayName;
        this.ownerUsername = ownerUsername;
        this.ownerProfilePicture = ownerProfilePicture;
        this.isAdvertiser = isAdvertiser;
    }
}
