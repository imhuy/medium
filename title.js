const puppeteer = require('puppeteer');
const URL = 'https://medium.com/the-break-down-wake-up-journal/i-went-my-entire-life-not-knowing-i-was-autistic-aa869b7b09ab'
async function processUrl(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const imgLinks = await page.evaluate(async () => {

        //get tag
        let title = document.getElementsByName('twitter:image:src')
        title = title[0]?.content;

        return title;
    });
    console.log(imgLinks)
    await browser.close();
    return imgLinks
}

processUrl(URL)