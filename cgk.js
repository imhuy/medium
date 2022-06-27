const fs = require('fs')
const puppeteer = require('puppeteer');
const URL = 'https://www.coingecko.com/learn/cexs-dexs-which-one-is-right'
const fetch = require('node-fetch');

async function processUrl(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const imgLinks = await page.evaluate(async () => {
        let body = document.getElementsByClassName('post-body')[0].innerHTML;
        let readmore = document.getElementsByClassName('post-body')[0].getElementsByClassName("tw-text-center")[0].innerHTML;

        let social = document.getElementsByClassName('post-body')[0].getElementsByClassName("tw-mb-4")[0].innerHTML;

        let tw = document.getElementsByClassName('post-body')[0].getElementsByClassName("tw-p-5")[0].innerHTML;

        let table = document.getElementById("table_of_contents")?.innerHTML;

        let title = document.title;
        let description = document.getElementsByName('description')[0].getAttribute('content');
        let imageUrl = document.getElementsByName('twitter:image')[0].getAttribute('content');
        let dex = '<div id="table_of_contents"></div>'
        body = body.replace(social, "");
        body = body.replace(readmore, "");
        body = body.replace(tw, "");
        body = body.replace(table, "");
        body = body.replace(dex, "");



        return {
            title: title,
            description: description,
            imageUrl: imageUrl,
            categories: [
                {
                    code: "guides",
                    name: "guides"
                }
            ],
            content: body,
        };
    });

    fs.writeFileSync('./data.json', imgLinks.content, 'utf-8');
    await browser.close();
    return imgLinks
}


async function post(body) {
    fetch('http://localhost:3000/post', {
        method: 'post',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
        .then(res => res.json())
        .then(json => console.log(json));
}


async function done() {
    let result = await processUrl(URL)
    console.log(result)
    await post(result)

}
done()