package hr.fer.styletrack.demo.auth;

import hr.fer.styletrack.demo.BaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;
import util.pages.FeedPage;
import util.pages.LoginPage;

import java.time.Duration;

public class LoginTest extends BaseTest {

    @Test
    public void testLogin() {
        try {
            LoginPage loginPage = feedPage.openLoginPage();

            loginPage.setUsername("seleniumTestAgent");
            loginPage.setPassword("seleniumTestPassw0rd");

            FeedPage feedPageAfterLogin = loginPage.clickLoginButton();

            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));

            Assert.assertTrue(feedPageAfterLogin.isMyWardrobesButtonPresent());
        } catch (Exception e) {
            Assert.fail(e.getMessage());
        }
    }
}
