
const puppeteer = require('puppeteer');
const URL = 'https://timdenning.medium.com/i-apologized-to-the-man-with-the-same-name-as-me-for-ruining-his-life-f8d915fcfe74'
const fetch = require('node-fetch');

async function processData(data) {
    let content = []
    for (const key in data) {
        if (key.includes('Paragraph')) {

            var startMarkup = data[key].markups.map(item => {
                if (item.href != null) {
                    a = `<${item.type.toLowerCase()} href='${item.href}'>`
                }
                else {
                    a = `<${item.type.toLowerCase()}>`
                }
                return a
            }).join(" ")

            var endMarkup = data[key].markups.map(item => {
                a = `</${item.type.toLowerCase()}>`
                return a
            }).join(" ")

            let start = data[key].markups[0]?.start
            let end = data[key].markups[0]?.end

            String.prototype.insert = function (index, string) {
                if (index > 0) {
                    return this.substring(0, index) + string + this.substr(index);
                }
                return string + this;
            };

            let r = data[key].text.insert(start, startMarkup)
            // console.log(data[key])

            let OpenTag = '<' + data[key].type.toLowerCase() + '>'
            let EndTag = '</' + data[key].type.toLowerCase() + '>'


            if (data[key].metadata != null) {
                let ImageId = data[key].metadata.__ref.replace('ImageMetadata:', '')
                let UrlImage = `https://cdn-images-1.medium.com/max/1024/${ImageId}`
                OpenTag = `<figure><${data[key].type.toLowerCase()} src ='${UrlImage}' width="100%"><figcaption>`
                EndTag = '</' + data[key].type.toLowerCase() + '></figure></figcaption>'
            }

            let strin = OpenTag + r.insert((end + startMarkup.length), endMarkup) + EndTag
            const regex = /oli/gi;
            let done = strin.replace(regex, 'li')
            content.push(done)
        }
    }
    return content.join('')
}

async function processUrl(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const imgLinks = await page.evaluate(async () => {

        //get tag
        let tag = document.getElementsByTagName('ul')
        tag = tag[tag.length - 1]?.innerText;
        tags = tag?.replace(/\n/gi, ',').split(",");

        //get thumb authour
        let thumb = document.querySelector('article').getElementsByTagName('img')
        let thumburl = thumb[0].currentSrc;

        //get content 
        let content = Array.from(document.getElementsByTagName('script')).map(a => a.innerText);
        const result = content.filter(word => word.startsWith('window.__APOLLO_STATE'))[0];
        const data = result.replace('window.__APOLLO_STATE__ = ', '');

        //get title 
        let title = document.getElementsByTagName('h1')
        title = title[0]?.innerText;

        //get description 
        let description = document.getElementsByTagName('h2')
        description = description[0]?.innerText;

        // get image
        let image = document.getElementsByName('twitter:image:src')
        image = image[0]?.content;

        let obj = {
            title: title,
            tags: [tags],
            image: image,
            content: data,
            description: description
        }
        return obj;
    });
    // console.log(imgLinks)
    await browser.close();
    return imgLinks
}



async function post(body) {
    fetch('http://localhost:9000/post', {
        method: 'post',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
        .then(res => res.json())
        .then(json => console.log(json));
}


async function done() {
    let r = await processUrl(URL)
    let x = await processData(JSON.parse(r.content))

    const body = {
        title: r.title,
        content: x,
        tag: r.tags,
        image: r.image,
        description: r.description
    }
//    console.log(body)
    await post(body)

}
done()
