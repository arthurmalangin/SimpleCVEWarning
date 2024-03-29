const axios = require('axios');
const Parser = require('rss-parser');
const fs = require('fs');

const parser = new Parser();
const webhookUrl = 'ADD TOKEN HERE';
let lastTitle = fs.existsSync(`${process.cwd()}/lastTitle.txt`) ? fs.readFileSync(`${process.cwd()}/lastTitle.txt`, 'utf8') : null;

async function checkFeed() {
    lastTitle = fs.readFileSync(`${process.cwd()}/lastTitle.txt`, 'utf8');
    const feed = await parser.parseURL('https://www.vmware.com/security/advisories.xml');
    const latest = feed.items[0];
    console.log(`${process.cwd()}/lastTitle.txt`);
    console.log('Latest title:', latest.title);
    if (latest.title !== lastTitle) {
        const message = {
            content: '@everyone Nouvelle Faille: ' + latest.title,
            embeds: [{
                title: latest.title,
                url: latest.link
            }]
        };

        axios.post(webhookUrl, message);

        lastTitle = latest.title;
        fs.writeFileSync('lastTitle.txt', lastTitle);
    }
}

setInterval(checkFeed, 60 * 1000);
