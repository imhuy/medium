
const fs = require('fs')
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    const url = 'https://medium.com/better-programming/deploying-a-react-app-to-aws-s3-e0f31be17734'
    await page.goto(url);

    const list = await page.evaluateHandle(() => {
        return Array.from(document.getElementsByTagName('script')).map(a => a.innerText);
    });
    let arr = await list.jsonValue()
    const result = arr.filter(word => word.startsWith('window.__APOLLO_STATE'))[0];
    const rpl = result.replace('window.__APOLLO_STATE__ = ', '');
    const obj = JSON.parse(rpl);

    // fs.writeFileSync('./data.json', rpl, 'utf-8');
    await browser.close();
    console.log(obj)
})();
