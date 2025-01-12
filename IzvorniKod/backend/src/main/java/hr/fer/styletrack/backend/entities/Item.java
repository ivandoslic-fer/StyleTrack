package hr.fer.styletrack.backend.entities;

import java.util.Collection;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
    private Collection<String> itemTags;

    public Item(){ }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id")
    @JsonBackReference
    private Section section;
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
}

