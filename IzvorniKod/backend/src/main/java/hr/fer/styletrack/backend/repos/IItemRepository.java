package hr.fer.styletrack.backend.repos;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import hr.fer.styletrack.backend.entities.Item;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface IItemRepository extends JpaRepository<Item, Long>, JpaSpecificationExecutor<Item> {
    Optional<Item> findByItemId(Long itemId);

    @Query("SELECT i FROM Item i WHERE i.section.wardrobe.isPublic = true")
    List<Item> findItemsInPublicWardrobes();
    List<Item> findAllBySection_Wardrobe_User_Username(String username);
}
