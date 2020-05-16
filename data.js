const { openBrowser, crawlSelector, newRekening, getMutasi, Loguot } = require("./dataCrwal");
const Apify = require('apify');

// crawl();
function crawl(credential) {
    Apify.main(async () => {
        try{
            const { page, browser } = await openBrowser();
            const { USERNAME_SELECTOR, PASSWORD_SELECTOR, BUTTON_Login, BUTTON_Rekening, BUTTON_Mutasi, BUTTON_Select, BUTTON_Select2, BUTTON_Logout, BUTTON_Logout2 } = crawlSelector();
            await newLogin2(page, USERNAME_SELECTOR, PASSWORD_SELECTOR, BUTTON_Login);
            await newRekening(page, BUTTON_Rekening, BUTTON_Mutasi, BUTTON_Select, BUTTON_Select2);
            await getMutasi(page);
            console.log("LogOutSuccess >" , credential.length);
            await Loguot(page, BUTTON_Logout, BUTTON_Logout2);
            await browser.close();
            return false;
            }   catch(error){
                console.error('Login Error',credential ,error)
                }
    });
    async function newLogin2(page, USERNAME_SELECTOR, PASSWORD_SELECTOR, BUTTON_Login) {
        await page.click(USERNAME_SELECTOR);
        await page.keyboard.type(credential.username);
        await page.click(PASSWORD_SELECTOR);
        await page.keyboard.type(credential.password);
        const navigate = page.waitForNavigation({ waitUntil: 'load' });
        await page.click(BUTTON_Login);
        await navigate;
    }
}

exports.crawl = crawl;