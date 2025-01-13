package hr.fer.styletrack.backend.entities;

import java.util.Collection;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "wardrobe")
@Getter
@Setter
public class Wardrobe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long wardrobeId;
    
    private String wardrobeName;
    private boolean isPublic;
    private String description; // Add this line

    @Column(nullable = true)
    private Double longitude;

    @Column(nullable = true)
    private Double latitude;

    public Wardrobe(){  }

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "wardrobe", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Collection<Section> sections;
}
