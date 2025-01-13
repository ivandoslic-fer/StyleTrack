package hr.fer.styletrack.backend.entities.itemcategories;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@DiscriminatorValue("FOOTWEAR")
@Getter
@Setter
public class FootwearCategory extends BaseCategory {

    private String shoeSize;
    private boolean openFoot;
    private boolean highHeeled;
    private String material;
    private boolean highShoes;
}
