package hr.fer.styletrack.backend.repos;

import hr.fer.styletrack.backend.entities.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ITagRepository extends JpaRepository<Tag, Long> {

    List<Tag> findTagsByTagNameStartingWith(String tagName);

    Optional<Tag> getTagByTagName(String tagName);
}
