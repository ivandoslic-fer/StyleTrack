package hr.fer.styletrack.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class DetailedOutfitDto {
    private Long id;
    private String name;
    private String season;
    private boolean forRain;
    private boolean forSnow;
    private boolean forWinter;
    private boolean forSummer;
    private boolean forAutumnSpring;
    private Long userId; // Simplified user representation
    private List<ItemDto> items; // List of associated items
}
