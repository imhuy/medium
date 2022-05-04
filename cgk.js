const fs = require('fs')
const puppeteer = require('puppeteer');
const URL = 'https://www.coingecko.com/buzz/cryptotag-review-seeds-stored-on-titanium'
 

async function processUrl(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const imgLinks = await page.evaluate(async () => {
        let body = document.getElementsByClassName('post-body')[0].innerHTML;
        let readmore = document.getElementsByClassName('post-body')[0].getElementsByClassName("tw-text-center")[0].innerHTML;

        let social = document.getElementsByClassName('post-body')[0].getElementsByClassName("tw-mb-4")[0].innerHTML;

        body = body.replace(social, "");
        body = body.replace(readmore, "");

        return body;
    });


    fs.writeFileSync('./data.json', imgLinks, 'utf-8');
    await browser.close();
    return imgLinks
}

processUrl(URL)