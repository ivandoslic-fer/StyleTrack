package hr.fer.styletrack.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

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

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "advertiser_profile_id")
    private List<AdvertiserLocation> locations = new ArrayList<>();

    // Constructors
    public AdvertiserProfile() {}

    public AdvertiserProfile(User user, String companyAddress, String companyEmail) {
        this.user = user;
        this.companyAddress = companyAddress;
        this.companyEmail = companyEmail;
    }

    public void addLocation(AdvertiserLocation location) {
        locations.add(location);
    }

    public void removeLocation(AdvertiserLocation location) {
        locations.remove(location);
    }
}
