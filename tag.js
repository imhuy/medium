const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    console.log('Browser openned');
    const page = await browser.newPage();
    const url = 'https://netflixtechblog.com/netflix-at-mit-code-2020-ad3745525218'
    await page.goto(url);

    const imgLinks = await page.evaluate(() => {
        let titleLinks = document.getElementsByTagName('ul')
        let tag = titleLinks[titleLinks.length - 1]?.innerText;
        tags = tag?.replace(/\n/gi, ',').split(",");
        return tags
    });
    console.log('tag');
    console.log(imgLinks);
 

    await browser.close();
    return imgLinks

})();
