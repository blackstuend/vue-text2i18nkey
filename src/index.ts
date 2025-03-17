import * as dotenv from 'dotenv';
import { askAI, initAi } from './ai';
import type { Options } from './types';
import glob from 'fast-glob';
import path from 'path';
import process from 'process';
import { findNeedToTranslateTexts, createI18nTable, updateLocalFile, updateVueFile } from './core';

dotenv.config();

initAi();

async function start(options: Options) {
    const { globPath = '**/*.{vue}' } = options;

    const files = glob.sync(globPath, {
        cwd: path.resolve(process.cwd()),
    });

    for(const file of files) {
        const texts = await findNeedToTranslateTexts(file)
        
        if(texts.length <= 0) {
            continue;
        }

       const map = await createI18nTable(file, texts, path.resolve(process.cwd(), 'examples/locales/zh-CN.json'));

       await updateLocalFile(path.resolve(process.cwd(), 'examples/locales/zh-CN.json'), map);
       
       await updateVueFile(file, map);
    }
}

start({ globPath: 'examples/**/*.vue' });

