import * as cheerio from 'cheerio';
import * as https from 'https';

function httpGet(options: https.RequestOptions | string | URL): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        https.get(options, (res) => {
            if (res.statusCode !== 200) {
                reject(res.statusMessage);
            }
            res.on('error', reject.bind(this));
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                resolve(data);
            });
        });
    });
}

function mapType(docType: string) {
    if (docType === 'Object') {
        return 'any';
    }
    if (docType === 'Array') {
        return 'any[]';
    }
    return docType.toLocaleLowerCase();
}

httpGet('https://www.froala.com/wysiwyg-editor/docs/options')
    .then((docData) => cheerio.load(docData))
    .then(($) => {
        const options = $('.editor-option').toArray().map((optionElement) => {
            const element = $(optionElement);
            const name = element.find('.option-name').text();
            const type = element.find('.type').text();
            const dflt = element.find('.default').text();
            const description = element.find('.description').text();
            return { name, type, default: dflt, description };
        });
        console.log(options);
    });
