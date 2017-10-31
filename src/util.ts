import { readFile, writeFile } from 'fs';
import * as https from 'https';
import { promisify } from 'util';

export function httpsGet(options: https.RequestOptions | string | URL): Promise<string> {
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

export const readFilePromise = promisify(readFile);

export const writeFilePromise = promisify(writeFile);

export function mapType(docType: string): string {
    switch (docType) {
        case 'String':
            return 'string';
        case 'Boolean':
            return 'boolean';
        case 'Integer':
        case 'Number':
            return 'number';
        case 'Array':
            return 'any[]';
        case 'XMLHttpRequest':
            return 'XMLHttpRequest';
        case 'jQuery object':
            return 'JQuery';
        case 'DOM Object':
        case 'DOM element':
            return 'HTMLElement';
        case 'Range object':
        case 'FroalaEditor Snapshot':
        case 'Object':
        case 'Object.':
        default:
            return 'any';
    }
}
