package hr.fer.styletrack.backend.repos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import hr.fer.styletrack.backend.entities.Category;

public interface ICategoryRepository extends JpaRepository<Category, Long>{
    Optional<Category> findByCategoryId(Long categoryId);
}
