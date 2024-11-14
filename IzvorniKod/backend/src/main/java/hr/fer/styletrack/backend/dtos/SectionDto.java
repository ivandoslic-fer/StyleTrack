package hr.fer.styletrack.backend.dtos;

import hr.fer.styletrack.backend.entities.Section;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SectionDto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long wardrobeId;
    private Long sectionId;
    private String sectionName;

    public SectionDto(Long wardrobeId, Long sectionId, String sectionName) {
        this.wardrobeId = wardrobeId;
        this.sectionId = sectionId;
        this.sectionName = sectionName;
    }

    public SectionDto(Section newSection) {
        this.sectionId = newSection.getSectionId();
        this.sectionName = newSection.getSectionName();
        this.wardrobeId = newSection.getWardrobe().getWardrobeId();
    }

    @Override
    public String toString() {
        return "{"
                + "        \"wardrobeId\":\"" + wardrobeId + "\""
                + ",         \"sectionId\":\"" + sectionId + "\""
                + ",         \"sectionName\":\"" + sectionName + "\""
                + "}";
    }
}