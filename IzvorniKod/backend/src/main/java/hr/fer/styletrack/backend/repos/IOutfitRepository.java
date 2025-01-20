package hr.fer.styletrack.backend.repos;

import hr.fer.styletrack.backend.entities.Outfit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IOutfitRepository extends JpaRepository<Outfit, Long> {
    Optional<List<Outfit>> findAllByIdIn(List<Long> ids);
    Optional<Outfit> findOutfitById(long id);
}
