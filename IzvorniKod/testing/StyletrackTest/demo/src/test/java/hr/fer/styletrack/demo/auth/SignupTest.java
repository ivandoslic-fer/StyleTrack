package hr.fer.styletrack.demo.auth;

import hr.fer.styletrack.demo.BaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;
import util.pages.FeedPage;
import util.pages.LoginPage;
import util.pages.RegisterPage;

import java.time.Duration;

public class SignupTest extends BaseTest {
    @Test
    public void testSignup() {
        try {
            RegisterPage registerPage = feedPage.openLoginPage().openRegisterPage();

            registerPage.enterEmail("seleniumTestAgent@styletrack.com");
            registerPage.enterUsername("seleniumTestAgent");
            registerPage.enterPassword("seleniumTestPassw0rd");
            registerPage.enterPasswordConfirm("seleniumTestPassw0rd");
            registerPage.enterDisplayName("Selenium Test");

            LoginPage loginPageAfterRegistration = registerPage.pressSignupButton();

            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));

            Assert.assertTrue(loginPageAfterRegistration.loginButtonPresent());
        } catch (Exception e) {
            Assert.fail(e.getMessage());
        }
    }
}
