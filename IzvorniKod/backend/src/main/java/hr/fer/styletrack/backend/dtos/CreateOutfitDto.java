package hr.fer.styletrack.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateOutfitDto {
    private String name; // Outfit name
    private List<Long> itemIds; // List of item IDs to link to the outfit
    private boolean forRain;
    private boolean forSnow;
    private boolean forWinter;
    private boolean forSummer;
    private boolean forAutumnSpring;

    @Override
    public String toString() {
        return "{"
                + "        \"name\":\"" + name + "\""
                + ",         \"itemIds\":" + itemIds
                + ",         \"forRain\":\"" + forRain + "\""
                + ",         \"forSnow\":\"" + forSnow + "\""
                + ",         \"forWinter\":\"" + forWinter + "\""
                + ",         \"forSummer\":\"" + forSummer + "\""
                + ",         \"forAutumnSpring\":\"" + forAutumnSpring + "\""
                + "}";
    }
}
