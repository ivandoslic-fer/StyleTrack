package hr.fer.styletrack.backend.entities;

import java.util.Collection;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
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
    // private Collection<String> tags;

    public Wardrobe(){  }

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "wardrobe", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Collection<Section> sections;
}
