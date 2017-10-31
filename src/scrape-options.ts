import * as cheerio from 'cheerio';
import * as Mustache from 'mustache';
import { httpsGet, mapType, readFilePromise, writeFilePromise } from './util';

Promise.all([
    readFilePromise('./templates/editor-options.mustache', 'utf8'),
    httpsGet('https://www.froala.com/wysiwyg-editor/docs/options').then((docData) => cheerio.load(docData))
])
    .then(([template, $]) => {
        const options = $('.editor-option').toArray().map((optionElement) => {
            const element = $(optionElement);
            const name = element.find('.option-name').text();
            const type = mapType(element.find('.type').text());
            const dflt = element.find('.default').text().replace(/\s+/g, ' ').trim();
            const description = element.find('.description').text().replace(/\s+/g, ' ').trim();
            return { name, type, default: dflt, description };
        });
        const data = Mustache.render(template, { options });
        return writeFilePromise('out/editor-options.ts', data);
    }).then(() => console.log('done'));
