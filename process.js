const fs = require('fs')
const data = require('./data.json')

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
            OpenTag = `<figure><${data[key].type.toLowerCase()} src ='${UrlImage}'><figcaption>`
            EndTag = '</' + data[key].type.toLowerCase() + '></figure></figcaption>'
        }

        let strin = OpenTag + r.insert((end + startMarkup.length), endMarkup) + EndTag
        const regex = /oli/gi;
        let done = strin.replace(regex, 'li')
        content.push(done)
    }
}

let html = content.join('')

fs.writeFileSync('./index.html', html, 'utf-8');
console.log(html)