import { askAI, askAIWithAssistant } from "./ai";
import { extractVueCode, flattenObject, replaceCode, getSearchReplaceBlocks, removeComments } from "./utils";
import { prompt as findTextSystemPrompt } from "./prompt/findText";
import { I18nTable } from "./types";
import fs from 'fs-extra';
import { prompt as genKeySystemPrompt } from "./prompt/genKey";
import { unflattenObject } from "./utils";
import { prompt as genVueDiffSystemPrompt } from "./prompt/genVueDiff";
import { prompt as genFullVueSystemPrompt } from "./prompt/genFullVue";
import dotenv from 'dotenv';

dotenv.config();
const defaultModel = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001';

export async function findNeedToTranslateTexts(filePath: string) {
    const code = extractVueCode(filePath);
    const codeWithoutComments = removeComments(code);

    const response = await askAI(defaultModel, findTextSystemPrompt, codeWithoutComments);
    
    if(!response) {
        return [];
    }

    const regex = /===\n([\s\S]*?)\n===/g;
    const matches = response.match(regex);

    if (matches) {
      let result = matches.map(match => {
        // Remove === and trim whitespace
        return match.replace(/===\n|\n===/g, '').trim();
      });

      result = result.filter(text => codeWithoutComments.includes(text));

      return result;
    } else {
       return [];
    }
}

export async function createI18nTable(localeJson: Object, texts: string[], filePath: string): Promise<I18nTable[]> {

    const flattenLocalJson = flattenObject(localeJson);

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
    const response = await askAI(defaultModel, genKeySystemPrompt, `
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

export async function combinedLocaleFile(localeJson: Object, i18nTable: I18nTable[]): Promise<Object> {
    const i18nTableMap = i18nTable.reduce((acc: any, item) => {
        acc[item.key] = item.value;
        return acc;
    }, {});

    const unflattenLocalJson = unflattenObject(i18nTableMap);

    // combine the localJson and unflattenLocalJson
    // Deep merge the locale objects to prevent overwriting nested objects
    const combinedJson = { ...localeJson };
    
    // Recursively merge objects
    const deepMerge = (target: any, source: any) => {
      for (const key in source) {
        if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
          // If both values are objects, merge them recursively
          deepMerge(target[key], source[key]);
        } else {
          // Otherwise just assign the value
          target[key] = source[key];
        }
      }
    };
    
    deepMerge(combinedJson, unflattenLocalJson);

    return combinedJson;
}

export async function updateVueFile(filePath: string, i18nTable: I18nTable[], useDiff: boolean) {
    const originCode = fs.readFileSync(filePath, 'utf-8');

    const assistantPrompt = `
    I18nTable: ${JSON.stringify(i18nTable)}
    `;

    if(useDiff) {
      const response = await askAIWithAssistant(defaultModel, genVueDiffSystemPrompt, assistantPrompt, originCode);

      if(!response) throw new Error('ask ai for updateVue failed, response: ' + response);

      const searchReplaceBlocks = getSearchReplaceBlocks(response).reverse();

      const updatedCode = replaceCode(originCode, searchReplaceBlocks);
  
      fs.writeFileSync(filePath, updatedCode);
    } else {
      const response = await askAIWithAssistant(defaultModel, genFullVueSystemPrompt, assistantPrompt, originCode);

      if(!response) throw new Error('ask ai for updateVue failed, response: ' + response);

      fs.writeFileSync(filePath, response);
    }
  }