package hr.fer.styletrack.backend.repos;

import hr.fer.styletrack.backend.entities.Wardrobe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IWardrobeRepository extends JpaRepository<Wardrobe, Long>{
    Optional<Wardrobe> findByWardrobeId(Long wardrobeId);

    List<Wardrobe> getWardrobesByPublicIsTrue();
}
