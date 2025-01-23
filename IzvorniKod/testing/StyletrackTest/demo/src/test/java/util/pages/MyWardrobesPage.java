package util.pages;

import org.openqa.selenium.By;
import util.BasePage;

public class MyWardrobesPage extends BasePage {
    private By createNewWardrobeButton = By.id("create-wardrobe-button");

    public CreateWardrobesPage openCreateWardrobesPage() {
        driver.findElement(createNewWardrobeButton).click();
        return new CreateWardrobesPage();
    }

    public boolean createButtonPresent() {
        return driver.findElement(createNewWardrobeButton).isDisplayed();
    }
}
