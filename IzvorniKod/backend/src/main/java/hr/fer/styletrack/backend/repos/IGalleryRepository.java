package hr.fer.styletrack.backend.repos;

import hr.fer.styletrack.backend.entities.ItemGallery;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IGalleryRepository extends JpaRepository<ItemGallery, Long> {
}
