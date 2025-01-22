package hr.fer.styletrack.demo.auth;

import hr.fer.styletrack.demo.BaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;
import util.pages.LoginPage;

import java.time.Duration;

public class BadLoginTest extends BaseTest {
    @Test
    public void testBadLogin() {
        try {
            LoginPage loginPage = feedPage.openLoginPage();

            loginPage.setUsername("seleniumTestAgent");
            loginPage.setPassword("badPassword123");

            loginPage.clickLoginButton();

            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(1));

            Assert.assertEquals(loginPage.getSnackbarText(), "Login failed. Please check your credentials.");
        } catch (Exception e) {
            Assert.fail(e.getMessage());
        }
    }
}
