const fetch = require('node-fetch');
const fs = require('fs')

function randomSring() {
    let r = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    if (r.includes('w') || r.includes('j')) {
        return
    }
    return r
}
function isvalid(text) {
    let chart = text.charAt(0)
    if (chart == 1) {
        return false
    }
    return true
}


async function check() {

    try {
        let str = await randomSring()
        let r = await fetch("https://blocklama.com/", {
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
            },

            "method": "GET",
        });
        let json = await r.text()
        islog = await isvalid(json)
        if (islog) {
            console.log(str)
            fs.appendFileSync('./tesst.txt', `${str} \r\n`,);
        }
    } catch (error) {

    }

}


(async () => {
    setInterval(() => {
        check();
    }, 10);
})()


