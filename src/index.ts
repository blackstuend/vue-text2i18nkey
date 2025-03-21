import * as dotenv from 'dotenv';
import { initAi } from './ai';
import type { Options } from './types';
import glob from 'fast-glob';
import path from 'path';
import process from 'process';
import { findNeedToTranslateTexts, createI18nTable, combinedLocaleFile, updateVueFile } from './core';
import fs from 'fs-extra';
import { Cache } from './cache';

dotenv.config();

if(!process.env.OPEN_ROUTER_API_KEY) {
    throw new Error('OPEN_ROUTER_API_KEY is required');
}

initAi();

let faileCount = 0;
export async function execute(options: Options) {
    let { localeFilePath, pathNested, withCache } = options;

    const globPath = pathNested ? '**/*.vue' : '*.vue';

    const cache = withCache ? new Cache(path.resolve(process.cwd(), '.vue-text2i18nkey.json')) : null;
    
    if(withCache && cache) {
        cache.load();
    }

    let files: string[] = [];

    if(options.file) {
        files = [options.file];
    } else {
        files = glob.sync(globPath, {
            cwd: path.resolve(process.cwd()),
        });
    }

    if(withCache && cache) {
        files = files.filter(file => {
            const cacheInfo = cache?.get(file);
            if(cacheInfo) {
                return !cacheInfo.success;
            }

            return true;
        })
    }

    console.log('File count: ', files.length);

    for(const file of files) {
        try {
            console.log('Start to process file: ', file);

            const texts = await findNeedToTranslateTexts(file)

            if(texts.length <= 0) {
                console.log('No need to translate texts, skip file: ', file);

                if(withCache && cache) {
                    cache?.add(file, true);
                    cache.save();
                }

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
           
           await updateVueFile(file, map);
           
           if(withCache && cache) {
               console.log('Finish to process file: ', file);
               cache?.add(file, true);
               cache.save();
           }

           console.log('Finish to process file: ', file);
           faileCount = 0;
        } catch(error) {
            faileCount++;

            if(faileCount > 5) {
                throw new Error('Failed over 5 times, please check the log');
            }

            if(withCache && cache) {
                console.log('Failed to process file: ', file);
                cache?.add(file, false, (error as Error).message);
                cache.save();
            }
            continue;
        }
    }
}
