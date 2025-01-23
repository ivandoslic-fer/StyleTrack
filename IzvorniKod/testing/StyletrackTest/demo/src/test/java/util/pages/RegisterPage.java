package util.pages;

import org.openqa.selenium.By;
import util.BasePage;

public class RegisterPage extends BasePage {
    private By emailField = By.id("email-field");
    private By usernameField = By.id("username-field");
    private By passwordField = By.id("password-field");
    private By passwordConfirmField = By.id("conf-password-field");
    private By displayNameField = By.id("display-name-field");
    private By signupButton = By.id("signup-button");

    public void enterEmail(String email) {
        set(emailField, email);
    }

    public void enterUsername(String username) {
        set(usernameField, username);
    }

    public void enterPassword(String password) {
        set(passwordField, password);
    }

    public void enterPasswordConfirm(String passwordConfirm) {
        set(passwordConfirmField, passwordConfirm);
    }

    public void enterDisplayName(String displayName) {
        set(displayNameField, displayName);
    }

    public LoginPage pressSignupButton() {
        click(signupButton);
        return new LoginPage();
    }
}
