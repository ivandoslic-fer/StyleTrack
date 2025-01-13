package hr.fer.styletrack.backend.misc;

import hr.fer.styletrack.backend.entities.Item;
import hr.fer.styletrack.backend.entities.itemcategories.ClothesCategory;
import hr.fer.styletrack.backend.entities.itemcategories.FootwearCategory;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ItemSpecifications {
    public static Specification<Item> byFilters(
            String itemName,
            String description,
            String seasonCategory,
            String brand,
            List<String> tags,
            String category,
            Map<String, String> categoryFilters) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // General filters
            if (itemName != null && !itemName.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("itemName")), "%" + itemName.toLowerCase() + "%"));
            }

            if (description != null && !description.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), "%" + description.toLowerCase() + "%"));
            }

            if (seasonCategory != null && !seasonCategory.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("seasonCategory"), seasonCategory));
            }

            if (brand != null && !brand.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("brand")), "%" + brand.toLowerCase() + "%"));
            }

            // Tags filtering
            if (tags != null && !tags.isEmpty()) {
                predicates.add(criteriaBuilder.exists(
                        query.subquery(Item.class)
                                .select(root)
                                .where(root.join("tags").get("tagName").in(tags))
                ));
            }

            // Category-specific filters
            if (category != null && !category.isEmpty()) {
                switch (category) {
                    case "CLOTHES":
                        predicates.add(criteriaBuilder.equal(root.get("category").type(), ClothesCategory.class));
                        if (categoryFilters.containsKey("fabric")) {
                            predicates.add(criteriaBuilder.equal(root.get("category").get("fabric"), categoryFilters.get("fabric")));
                        }
                        if (categoryFilters.containsKey("size")) {
                            predicates.add(criteriaBuilder.equal(root.get("category").get("size"), categoryFilters.get("size")));
                        }
                        if (categoryFilters.containsKey("longSleeved")) {
                            predicates.add(criteriaBuilder.equal(root.get("category").get("longSleeved"), Boolean.parseBoolean(categoryFilters.get("longSleeved"))));
                        }
                        break;

                    case "FOOTWEAR":
                        predicates.add(criteriaBuilder.equal(root.get("category").type(), FootwearCategory.class));
                        if (categoryFilters.containsKey("shoeSize")) {
                            predicates.add(criteriaBuilder.equal(root.get("category").get("shoeSize"), categoryFilters.get("shoeSize")));
                        }
                        if (categoryFilters.containsKey("openFoot")) {
                            predicates.add(criteriaBuilder.equal(root.get("category").get("openFoot"), Boolean.parseBoolean(categoryFilters.get("openFoot"))));
                        }
                        if (categoryFilters.containsKey("highHeeled")) {
                            predicates.add(criteriaBuilder.equal(root.get("category").get("highHeeled"), Boolean.parseBoolean(categoryFilters.get("highHeeled"))));
                        }
                        if (categoryFilters.containsKey("material")) {
                            predicates.add(criteriaBuilder.equal(root.get("category").get("material"), categoryFilters.get("material")));
                        }
                        break;

                    default:
                        throw new IllegalArgumentException("Unsupported category type: " + category);
                }
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
