import * as cheerio from 'cheerio';
import * as Mustache from 'mustache';
import { httpsGet, mapType, readFilePromise, writeFilePromise } from './util';

Promise.all([
    readFilePromise('./templates/editor-methods.mustache', 'utf8'),
    httpsGet('https://www.froala.com/wysiwyg-editor/docs/methods').then((docData) => cheerio.load(docData))
])
    .then(([template, $]) => {
        const methods = $('.editor-option').toArray().map((optionElement) => {
            const element = $(optionElement);
            const name = element.find('.option-name').text().split('(')[0].trim();
            const type = mapType(element.find('.info .type').text());
            const description = element.find('.description').text().replace(/\s+/g, ' ').trim();
            const params = element.find('ul').children('li').toArray().map((listElement) => {
                const le = $(listElement);
                if (le.text().includes('This method does not accept any arguments.')) {
                    return '';
                }
                const paramName = le.find('p strong').text().trim();
                const paramType = mapType(le.find('.type').text());
                return `, ${paramName}: ${paramType}`;
            }).join('');
            return { name, type, description, params };
        });
        const data = Mustache.render(template, { methods });
        return writeFilePromise('out/editor-methods.ts', data);
    }).then(() => console.log('done'));
