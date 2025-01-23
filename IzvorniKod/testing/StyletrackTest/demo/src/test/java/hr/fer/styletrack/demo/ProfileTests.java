package hr.fer.styletrack.demo;

import org.testng.annotations.BeforeClass;
import util.pages.LoginPage;

public class ProfileTests extends BaseTest {
    @BeforeClass
    public void login() {
        LoginPage loginPage = feedPage.openLoginPage();

        loginPage.setUsername("seleniumTest");
        loginPage.setPassword("seleniumTestPassw0rd");

        feedPage = loginPage.clickLoginButton();
    }


}
