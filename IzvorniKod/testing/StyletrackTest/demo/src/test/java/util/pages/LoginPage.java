package util.pages;

import org.openqa.selenium.By;
import util.BasePage;

public class LoginPage extends BasePage {
    private By usernameField = By.id("user-name");
    private By passwordField = By.id("password");
    private By loginButton = By.id("login-button");
    private By gotoRegister = By.id("goto-register");

    public void setUsername(String username) {
        set(usernameField, username);
    }

    public void setPassword(String password) {
        set(passwordField, password);
    }

    public FeedPage clickLoginButton() {
        click(loginButton);
        return new FeedPage();
    }

    public BasePage logIntoApplication(String username, String password) {
        setUsername(username);
        setPassword(password);
        return clickLoginButton();
    }

    public boolean loginButtonPresent() {
        return find(loginButton).isDisplayed();
    }

    public RegisterPage openRegisterPage() {
        click(gotoRegister);
        return new RegisterPage();
    }

    public String getSnackbarText() {
        return find(snackBar).getText();
    }
}
