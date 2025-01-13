package hr.fer.styletrack.backend.dtos;

import hr.fer.styletrack.backend.entities.AdvertiserLocation;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
public class AdvertiserDto {
    
    private Long id;
    private String companyAdress;
    private String companyEmail;
    private List<AdvertiserLocation> locations;

    public AdvertiserDto(Long id, String companyAdress, String companyEmail, List<AdvertiserLocation> locations) {
        this.id = id;
        this.companyAdress = companyAdress;
        this.companyEmail = companyEmail;
        this.locations = locations;
    }
}
