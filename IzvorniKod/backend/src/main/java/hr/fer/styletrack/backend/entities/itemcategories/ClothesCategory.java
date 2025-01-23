package hr.fer.styletrack.backend.entities.itemcategories;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@DiscriminatorValue("CLOTHES")
@Getter
@Setter
public class ClothesCategory extends BaseCategory {

    private String fabric;
    private String size;
    private boolean longSleeved;
}
