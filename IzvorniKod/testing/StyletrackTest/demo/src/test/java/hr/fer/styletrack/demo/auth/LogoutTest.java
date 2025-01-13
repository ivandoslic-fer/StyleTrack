package hr.fer.styletrack.demo.auth;

import hr.fer.styletrack.demo.BaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;
import util.pages.FeedPage;
import util.pages.LoginPage;

import java.time.Duration;

public class LogoutTest extends BaseTest {
    @Test
    public void testLogout() {
        try {
            LoginPage loginPage = feedPage.openLoginPage();

            loginPage.setUsername("seleniumTest");
            loginPage.setPassword("seleniumTestPassw0rd");

            FeedPage feedPageAfterLogin = loginPage.clickLoginButton();

            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));

            FeedPage feedPageAfterLogout = feedPageAfterLogin.pressLogoutButton();

            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));

            Assert.assertFalse(feedPageAfterLogout.isMyWardrobesButtonPresent());
        } catch (Exception e) {
            Assert.fail(e.getMessage());
        }
    }
}
