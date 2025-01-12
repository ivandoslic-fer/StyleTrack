package hr.fer.styletrack.backend.dtos;

import hr.fer.styletrack.backend.entities.Category;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryDto {
    private Long categoryId;
    private String categoryName;

    public CategoryDto(Long categoryId, String categoryName){
         this.categoryId = categoryId;
         this.categoryName = categoryName;
    }

    public CategoryDto(Category category){
        this.categoryId = category.getCategoryId();
        this.categoryName = category.getCategoryName();
    }

    @Override
    public String toString(){
        return "{"
        + "        \"categoryId\":\"" + categoryId + "\""
        + ",         \"categoryName\":\"" + categoryName + "\""
        + "}";
    }
}
