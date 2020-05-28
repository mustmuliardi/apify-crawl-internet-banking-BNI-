const Apify = require('apify');

async function openBrowser() {
    const browser = await Apify.launchPuppeteer({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage()
        await page.goto('https://ibank.bni.co.id/MBAWeb/FMB;jsessionid=0000A0Hsinh5wkdMhLj26NOCI3s:1a1li5jho?page=Thin_SignOnRetRq.xml&MBLocale=bh',{timeout:240000});
        return { page, browser };
}
exports.openBrowser = openBrowser;

function crawlSelector() {
    const USERNAME_SELECTOR = '#CorpId';
    const PASSWORD_SELECTOR = '#PassWord';
    const BUTTON_Login = 'input[type="submit"]';
    const BUTTON_Rekening = 'td#MBMenuList_td:nth-child(1)';
    const BUTTON_Mutasi = '#AccountMenuList_table:nth-child(3)';
    const BUTTON_Select = '#AccountIDSelectRq';
    const BUTTON_Select2 = '#FullStmtInqRq';
    const BUTTON_Logout = '#LogOut';
    const BUTTON_Logout2 = '#__LOGOUT__';
    return { USERNAME_SELECTOR, PASSWORD_SELECTOR, BUTTON_Login, BUTTON_Rekening, BUTTON_Mutasi, BUTTON_Select, BUTTON_Select2, BUTTON_Logout, BUTTON_Logout2 };
}
exports.crawlSelector = crawlSelector;

async function newRekening(page, BUTTON_Rekening, BUTTON_Mutasi, BUTTON_Select, BUTTON_Select2) {
    const navigate2 = page.waitForNavigation({ waitUntil: 'load' });
    await page.click(BUTTON_Rekening);
    await navigate2;
    const navigate3 = page.waitForNavigation({ waitUntil: 'load' });
    await page.click(BUTTON_Mutasi);
    await navigate3;
    const navigate4 = page.waitForNavigation({ waitUntil: 'load' });
    await page.select('select[name="MAIN_ACCOUNT_TYPE"]', 'OPR');
    await page.click(BUTTON_Select);
    await navigate4;
    const navigate5 = page.waitForNavigation({ waitUntil: 'load'});
    await page.select('select[name="TxnPeriod"]', 'LastWeek');
    await page.click(BUTTON_Select2);
    await navigate5;
}
exports.newRekening = newRekening;

async function Loguot(page, BUTTON_Logout, BUTTON_Logout2) {
    const navigate7 = page.waitForNavigation({ waitUntil: 'load' });
    await page.click(BUTTON_Logout);
    await navigate7;
    await page.click(BUTTON_Logout2);
}
exports.Loguot = Loguot;

async function getMutasi(page) {
    let mutasiRekening = await page.evaluate(() => {
        let mutasi = [];
        let mutasiElms = document.querySelectorAll('#TitleBar');
        mutasiElms.forEach((mutasiElement) => {
            try {
                mutasi.push({
                NomorRekening : mutasiElement.querySelector('span:nth-child(2) ').innerText,
                Tanggal : mutasiElement.querySelector('.CommonTableClass:nth-child(5)').innerText,
                Uraian : mutasiElement.querySelector('.CommonTableClass:nth-child(6)').innerText,
                Tipe : mutasiElement.querySelector('.CrText:nth-child(2)').innerText,
                Nominal : mutasiElement.querySelector('.CommonTableClass:nth-child(8)').innerText,
                Saldo_Akhir : mutasiElement.querySelector('.CommonTableClass:nth-child(9)').innerText,
                });
            }   
            catch (err){
                console.log(err);
            }
        });
        return mutasi;
    });
    await Apify.pushData(mutasiRekening);
}
exports.getMutasi=getMutasi;