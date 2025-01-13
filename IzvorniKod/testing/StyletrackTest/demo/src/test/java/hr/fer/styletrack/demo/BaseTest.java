package hr.fer.styletrack.demo;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import util.BasePage;
import util.pages.FeedPage;
import util.pages.LoginPage;

public class BaseTest {
    protected WebDriver driver;
    protected BasePage basePage;
    protected FeedPage feedPage;
    private String url = "http://localhost:5173";

    @BeforeClass
    public void setUp() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.get(url);
        basePage = new BasePage();
        basePage.setDriver(driver);
        feedPage = new FeedPage();
    }

    @AfterClass
    public void tearDown() {
        driver.quit();
    }
}
