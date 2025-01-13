package hr.fer.styletrack.backend.entities.itemcategories;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import static jakarta.persistence.InheritanceType.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "category_type")
@Getter
@Setter
public abstract class BaseCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;

    private String categoryName;

    private String seasonCategory;
    private String formalityCategory;
}
