package hr.fer.styletrack.backend.entities;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import hr.fer.styletrack.backend.entities.itemcategories.BaseCategory;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "item")
@Getter
@Setter
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemId;

    private String itemName;
    private String description;
    private String seasonCategory;
    private String brand;
    private boolean forSharing;

    private String mainImageUrl;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ItemGallery> gallery = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private BaseCategory category;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "item_tag",
            joinColumns = @JoinColumn(name = "item_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

    public Item(){ }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id")
    @JsonBackReference
    private Section section;

    public void addGalleryImage(ItemGallery gallery) {
        gallery.setItem(this); // Set the back-reference
        this.gallery.add(gallery); // Add to the collection
    }

    public void removeGalleryImage(ItemGallery gallery) {
        gallery.setItem(null); // Remove the back-reference
        this.gallery.remove(gallery); // Remove from the collection
    }
}

