package hr.fer.styletrack.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "item_gallery")
@Getter
@Setter
public class ItemGallery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long galleryId;

    @Column(nullable = false)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    public ItemGallery() {}

    public ItemGallery(String imageUrl, Item item) {
        this.imageUrl = imageUrl;
        this.item = item;
    }
}
