package hr.fer.styletrack.backend.repos;

import hr.fer.styletrack.backend.entities.itemcategories.BaseCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IBaseCategoryRepository extends JpaRepository<BaseCategory, Long> {

    Optional<BaseCategory> findByCategoryName(String category);
}
