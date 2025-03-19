import * as dotenv from 'dotenv';
import { initAi } from './ai';
import type { Options } from './types';
import glob from 'fast-glob';
import path from 'path';
import process from 'process';
import { findNeedToTranslateTexts, createI18nTable, combinedLocaleFile, updateVueFile } from './core';
import fs from 'fs-extra';

dotenv.config();

if(!process.env.OPEN_ROUTER_API_KEY) {
    throw new Error('OPEN_ROUTER_API_KEY is required');
}

initAi();


export async function execute(options: Options) {
    let { localeFilePath, pathNested, useDiff } = options;

    const globPath = pathNested ? '**/*.vue' : '*.vue';

    let files: string[] = [];

    if(options.file) {
        files = [options.file];
    } else {
        files = glob.sync(globPath, {
            cwd: path.resolve(process.cwd()),
        });
    }

    for(const file of files) {
        console.log('Start to process file: ', file);

        const texts = await findNeedToTranslateTexts(file)
        
        if(texts.length <= 0) {
            console.log('No need to translate texts, skip file: ', file);
            continue;
        }

        const localeFile = fs.readJSONSync(localeFilePath);

        if(!localeFile) {
            throw new Error('locale file not found');
        }

       const map = await createI18nTable(localeFile, texts, file);

       const newLocaleFile = await combinedLocaleFile(localeFile, map);

       fs.writeJSONSync(localeFilePath, newLocaleFile, {
        spaces: 2,
        EOL: '\n'
       });
       
       await updateVueFile(file, map, useDiff);

       console.log('Finish to process file: ', file);
    }
}
