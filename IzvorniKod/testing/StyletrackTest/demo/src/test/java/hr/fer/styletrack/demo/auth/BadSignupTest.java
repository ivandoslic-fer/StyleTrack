package hr.fer.styletrack.demo.auth;

import hr.fer.styletrack.demo.BaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;
import util.pages.LoginPage;
import util.pages.RegisterPage;

import java.time.Duration;

public class BadSignupTest extends BaseTest {
    @Test
    public void testBadSignup() {
        try {
            RegisterPage registerPage = feedPage.openLoginPage().openRegisterPage();

            registerPage.enterEmail("seleniumTestAgent2@styletrack.com");
            // Do not enter the username
            registerPage.enterPassword("seleniumTestPassw0rd");
            registerPage.enterPasswordConfirm("seleniumTestPassw0rd");
            registerPage.enterDisplayName("Selenium Test 2");

            LoginPage loginPageAfterRegistration = registerPage.pressSignupButton();

            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(1));

            Assert.assertEquals(loginPageAfterRegistration.getSnackbarText(), "Username cannot be empty");
        } catch (Exception e) {
            Assert.fail(e.getMessage());
        }
    }
}
