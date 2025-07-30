import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templateCache = new Map();

export const renderTemplate = async (templateName: string, data: any) => {
    const templateFolderPath = path.join(__dirname, `./templates/${templateName}`);

    const modulePath = path.join(templateFolderPath, 'data.ts');
    const dataPreparationModule = await import(modulePath);
    const templateData = dataPreparationModule.prepareData(data);

    let compiledTemplate = templateCache.get(templateName);
    if (!compiledTemplate) {
        const templateSource = fs.readFileSync(path.join(templateFolderPath, 'template.hbs'), 'utf8');
        compiledTemplate = handlebars.compile(templateSource);
        templateCache.set(templateName, compiledTemplate);
    }

    return compiledTemplate(templateData);
};
