package hr.fer.styletrack.backend.repos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import hr.fer.styletrack.backend.entities.Section;

public interface ISectionRepository extends JpaRepository<Section, Long>{
    Optional<Section> findBySectionId(Long sectionId);
}
