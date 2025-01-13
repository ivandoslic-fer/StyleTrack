package util.pages;

import org.openqa.selenium.By;
import util.BasePage;

public class FeedPage extends BasePage {
    private By gotoLogin = By.id("goto-login");
    private By myWardrobesButton = By.id("my-wardrobes-button");
    private By logoutButton = By.id("logout-button");

    public boolean isMyWardrobesButtonPresent() {
        return find(myWardrobesButton).isDisplayed();
    }

    public LoginPage openLoginPage() {
        driver.findElement(gotoLogin).click();
        return new LoginPage();
    }

    public FeedPage pressLogoutButton() {
        driver.findElement(logoutButton).click();
        return new FeedPage();
    }
}
