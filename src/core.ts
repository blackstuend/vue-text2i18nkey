import { askAI } from "./ai";
import { extractVueCode, flattenObject } from "./utils";
import { prompt as findTextSystemPrompt } from "./prompt/findText";
import { I18nTable } from "./types";
import fs from 'fs-extra';
import { prompt as genKeySystemPrompt } from "./prompt/genKey";
import { unflattenObject } from "./utils";
import { prompt as updateVueSystemPrompt } from "./prompt/vueReplacer";
import { getSearchReplaceBlocks, replaceCode } from "./utils";

export async function findNeedToTranslateTexts(filePath: string) {
    const code = extractVueCode(filePath);

    const response = await askAI('deepseek/deepseek-chat', findTextSystemPrompt, code);

    if(!response) {
        return [];
    }

    const regex = /===\n([\s\S]*?)\n===/g;
    const matches = response.match(regex);

    if (matches) {
      return matches.map(match => {
        // Remove === and trim whitespace
        return match.replace(/===\n|\n===/g, '').trim();
      });
    } else {
       return [];
    }
}

export async function createI18nTable(filePath: string ,texts: string[], localeFilePath: string): Promise<I18nTable[]> {
    const localJson = fs.readJSONSync(localeFilePath);

    const flattenLocalJson = flattenObject(localJson);

    const tempTable: {
        value: string;
        keys: string[];
    }[] = [];

    for(const text of texts) {
        const keys = Object.keys(flattenLocalJson).filter(key => flattenLocalJson[key] === text);

        tempTable.push({
          value: text,
          keys
        })
    };

    // ask ai to generate the i18n table
    const response = await askAI('google/gemini-2.0-flash-001', genKeySystemPrompt, `
        FilePath: ${filePath}
        Texts: ${JSON.stringify(tempTable)}
        `);
    
    if (!response) {
        return [];
    }

    // Parse the response using the new format with ===key, ===value, and === delimiters
    const i18nTable: I18nTable[] = [];
    const regex = /===key\s+([\s\S]*?)\s+===value\s+([\s\S]*?)\s+===/g;
    
    let match;
    while ((match = regex.exec(response)) !== null) {
        const key = match[1].trim();
        const value = match[2].trim();
        
        if (key && value) {
            i18nTable.push({
                key,
                value
            });
        }
    }

    return i18nTable;
}

export async function updateLocalFile(filePath: string, i18nTable: I18nTable[]) {
    const localJson = fs.readJSONSync(filePath);

    const i18nTableMap = i18nTable.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
    }, {});

    const unflattenLocalJson = unflattenObject(i18nTableMap);


    // combine the localJson and unflattenLocalJson
    const combinedJson = { ...localJson, ...unflattenLocalJson };

    fs.writeJSONSync(filePath, combinedJson, {
        spaces: 2,
        EOL: '\n'
    });
}

export async function updateVueFile(filePath: string, i18nTable: I18nTable[]) {
    const originCode = fs.readFileSync(filePath, 'utf-8') + '\n';

    const response = await askAI('google/gemini-2.0-flash-001', updateVueSystemPrompt, originCode);

    if(!response) throw new Error('ask ai for updateVue failed, response: ' + response);
  
    const matches = getSearchReplaceBlocks(response).reverse();

    console.log('response', response)

    let newCode = replaceCode(originCode, matches);


    fs.writeFileSync(filePath, newCode);
}