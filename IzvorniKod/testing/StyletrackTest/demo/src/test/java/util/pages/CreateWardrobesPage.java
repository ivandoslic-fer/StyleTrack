package util.pages;

import org.openqa.selenium.By;
import util.BasePage;

public class CreateWardrobesPage extends BasePage {
    private By WardrobeNameField = By.id("wardrobe-name-field");
    private By WardrobeDescriptionField = By.id("wardrobe-description-field");
    private By SaveButton = By.id("save-button");

    public void enterWardrobeName(String wardrobeName) {
        set(WardrobeNameField, wardrobeName);
    }

    public void enterWardrobeDescription(String wardrobeDescription) {
        set(WardrobeDescriptionField, wardrobeDescription);
    }

    public MyWardrobesPage clickSaveButton() {
        click(SaveButton);
        return new MyWardrobesPage();
    }

    public String getSnackbarText() {
        return find(snackBar).getText();
    }
}
