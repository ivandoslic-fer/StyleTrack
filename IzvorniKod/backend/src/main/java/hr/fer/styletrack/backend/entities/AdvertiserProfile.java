package hr.fer.styletrack.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Entity
@Setter
@Getter
public class AdvertiserProfile implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String companyAddress;
    private String companyEmail;

    // Constructors
    public AdvertiserProfile() {}

    public AdvertiserProfile(User user, String companyAddress, String companyEmail) {
        this.user = user;
        this.companyAddress = companyAddress;
        this.companyEmail = companyEmail;
    }
}
