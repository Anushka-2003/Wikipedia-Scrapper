// To run the script
// npm install minimist
// npm install puppeteer
// npm install pdf-lib
// node wiki.js --url=https://www.google.com/
// all the contents will get stored in the content folder
// content folder will be made only if it is not present previously


let minimist = require("minimist");
let puppeteer = require("puppeteer");
let fs = require("fs");
let path = require('path');
let pdf = require("pdf-lib");


let args = minimist(process.argv);

start();
async function start() {
    let browser = await puppeteer.launch({
        headless: false,
        args: [
            '--start-maximized'
        ],
        defaultViewport: {
            width: 1600,
            height: 1080,
            isMobile: false
        }
    });

    let pages = await browser.pages();
    await pages[0].goto(args.url);

    // click to type on google
    await pages[0].waitForSelector(".gLFyf.gsfi");
    await pages[0].click(".gLFyf.gsfi");

    // type domain
    await pages[0].waitForSelector(".gLFyf.gsfi");
    await pages[0].type(".gLFyf.gsfi", "wikipedia", { delay: 50 });
    await pages[0].keyboard.press("Enter");

    // click on first search result
    await pages[0].waitForSelector("a[href='https://www.wikipedia.org/']");
    await pages[0].click('a[href="https://www.wikipedia.org/"]');

    // click on english
    await pages[0].waitForSelector('div[lang="en"]');
    await pages[0].click('div[lang="en"]');

    // click on All portals
    await pages[0].waitForSelector("a[href='/wiki/Wikipedia:Contents/Portals']");
    await pages[0].click("a[href='/wiki/Wikipedia:Contents/Portals']");

    // click on first A-Z indicies
    let pages1 = await browser.pages();
    await pages1[0].goto("https://en.wikipedia.org/wiki/Wikipedia:Contents/A%E2%80%93Z_index");

    // click on alphabet A
    await pages1[0].waitForSelector('a[href="/wiki/Special:AllPages/A"]');
    await pages1[0].click('a[href="/wiki/Special:AllPages/A"]');

    // click on first article of A
    await pages1[0].waitForSelector('a[href="/wiki/A"]');
    await pages1[0].click('a[href="/wiki/A"]');


    const folderName = "Contents"
    try {
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName)
        }
    } catch (err) {
        console.error(err)
    }


    // goto history and get its content
    let newPath1 = path.join(folderName, "1_historyContent.png");
    let page2 = await browser.newPage();
    await page2.goto("https://en.wikipedia.org/wiki/A#History");
    await page2.screenshot({ path: newPath1 });
    await page2.close();
    
    
    // back to main menu
    await pages1[0].bringToFront();
    
    
    // goto writing systems and get its content
    let newPath2 = path.join(folderName, "2_writingSystemContent.png");
    let page3 = await browser.newPage();
    await page3.goto("https://en.wikipedia.org/wiki/A#Use_in_writing_systems");
    await page3.screenshot({ path: newPath2 });
    await page3.close();
    
    // back to main menu
    await pages1[0].bringToFront();
    
    // goto other uses and get its content
    let newPath3 = path.join(folderName, "3_otherUsesContent.png");
    let page4 = await browser.newPage();
    await page4.goto("https://en.wikipedia.org/wiki/A#Other_uses");
    await page4.screenshot({ path: newPath3 });
    await page4.close();

    // back to main menu
    await pages1[0].bringToFront();


    browser.close();

}

