package hr.fer.styletrack.demo.wardrobes;

import hr.fer.styletrack.demo.BaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;
import util.pages.CreateWardrobesPage;
import util.pages.FeedPage;
import util.pages.LoginPage;
import util.pages.MyWardrobesPage;

import java.time.Duration;

public class CreateWardrobeTest extends BaseTest {
    @Test
    public void createWardrobeTest() {
        try {
            LoginPage loginPage = feedPage.openLoginPage();

            loginPage.setUsername("seleniumTestAgent");
            loginPage.setPassword("seleniumTestPassw0rd");

            FeedPage feedPageAfterLogin = loginPage.clickLoginButton();

            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(2));

            MyWardrobesPage wardrobesPage = feedPageAfterLogin.pressMyWardrobesButton();

            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(1));

            CreateWardrobesPage createWardrobesPage = wardrobesPage.openCreateWardrobesPage();

            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(1));

            createWardrobesPage.enterWardrobeName("New Test Wardrobe");
            createWardrobesPage.enterWardrobeDescription("This is a new test wardrobe");

            wardrobesPage = createWardrobesPage.clickSaveButton();

            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(3));

            Assert.assertTrue(wardrobesPage.createButtonPresent());
        } catch (Exception e) {
            Assert.fail(e.getMessage());
        }
    }
}
