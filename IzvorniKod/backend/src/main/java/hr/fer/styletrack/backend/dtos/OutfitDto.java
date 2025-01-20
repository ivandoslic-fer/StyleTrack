package hr.fer.styletrack.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@AllArgsConstructor
public class OutfitDto {
    private Long id;
    private String name;
    private String season;
    private boolean forRain;
    private boolean forSnow;
    private boolean forWinter;
    private boolean forSummer;
    private boolean forAutumnSpring;
    private Set<Long> itemIds; // Only include item IDs to avoid deep nesting
    private Long userId; // Only include the user ID
}
