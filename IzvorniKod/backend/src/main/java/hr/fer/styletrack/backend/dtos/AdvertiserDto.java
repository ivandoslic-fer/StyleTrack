package hr.fer.styletrack.backend.dtos;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class AdvertiserDto {
    
    private Long id;
    private String companyAdress;
    private String companyEmail;

    public AdvertiserDto(Long id, String companyAdress, String companyEmail) {
        this.id = id;
        this.companyAdress = companyAdress;
        this.companyEmail = companyEmail;
    }
}
