package hr.fer.styletrack.backend.repos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import hr.fer.styletrack.backend.entities.Item;

public interface IItemRepository extends JpaRepository<Item, Long>{
    Optional<Item> findByItemId(Long itemId);
}
