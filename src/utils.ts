import { parse } from '@vue/compiler-sfc';
import path from 'path';
import fs from 'fs-extra';

/**
 * Extract the code from a Vue file, only include the template, script, without the style
 * @param filePath - The path to the Vue file
 * @returns The code of the Vue file
 */
export function extractVueCode(filePath: string) {
    const absolutePath = path.resolve(process.cwd(), filePath);
    const content = fs.readFileSync(absolutePath, 'utf-8');

    const { descriptor } = parse(content);

    let code = '';

    if (descriptor.template) {
        code += `<template>${descriptor.template.content}</template>`;
    }

    if (descriptor.script) {
        code += `<script>${descriptor.script.content}</script>`;
    }

    if (descriptor.scriptSetup) {
        code += `<script setup>${descriptor.scriptSetup.content}</script>`;
    }

    return code;
}

/**
 * Flatten an object into a single level of keys
 * @param obj - The object to flatten
 * @param prefix - The prefix for the keys
 * @returns A flattened object
 */
export function flattenObject(obj: any, prefix = ''): Record<string, any> {
    return Object.keys(obj).reduce((acc, key) => {
      const pre = prefix.length ? `${prefix}.` : '';
  
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(acc, flattenObject(obj[key], `${pre}${key}`));
      } else {
        acc[`${pre}${key}`] = obj[key];
      }
  
      return acc;
    }, {});
}

export function unflattenObject(obj: Record<string, any>): any {
    return Object.keys(obj).reduce((acc, key) => {
        const parts = key.split('.');
        let current = acc;
        
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            current[part] = current[part] || {};
            current = current[part];
        }
        
        current[parts[parts.length - 1]] = obj[key];
        return acc;
    }, {});
}


interface ReplaceMatch {
  search: string
  replace: string
}

export function getSearchReplaceBlocks(response: string): ReplaceMatch[] {
  const regex = /<{3,10} SEARCH\n([\s\S]*?)={3,10}\n([\s\S]*?)>{3,10} REPLACE/gi
  const matches: ReplaceMatch[] = []
  let match

  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(response)) !== null) {
    matches.push({
      search: match[1],
      replace: match[2],
    })
  }

  return matches
}

export function replaceCode(originCode: string, matches: ReplaceMatch[]) {
  let result = originCode

  matches.forEach((match) => {
    const newResult = result.replace(match.search, match.replace)

    result = newResult
  })
  return result
}