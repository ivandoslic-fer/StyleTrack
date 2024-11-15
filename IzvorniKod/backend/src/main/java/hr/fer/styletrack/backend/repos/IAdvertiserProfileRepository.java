package hr.fer.styletrack.backend.repos;

import hr.fer.styletrack.backend.entities.AdvertiserProfile;
import hr.fer.styletrack.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IAdvertiserProfileRepository extends JpaRepository<AdvertiserProfile, Long> {
    Optional<AdvertiserProfile> findAdvertiserProfileByUser(User user);
}
