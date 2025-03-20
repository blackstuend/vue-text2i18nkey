import { Options } from './types';
import fs from 'fs-extra';
import { program } from 'commander';
import { execute } from './index';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

program
  .option('--file <path>', 'Process a single Vue file, if not provided and --nested is set, all Vue files in subdirectories will be processed')
  .option('--use-diff <bool>', 'Use diff format for changes', true)
  .option('--nested', 'Process all Vue files in a directory', false)
  .option('--with-cache <bool>', 'Use cache to skip processed files', true)
  .parse(process.argv);

const options = program.opts();

const defaultOption: Options = {
  localeFilePath: process.env.LOCALE_FILE_PATH || '',
  pathNested: options.nested,
  useDiff: options.useDiff,
  file: options.file,
  withCache: options.withCache,
};

if (!defaultOption.localeFilePath || !fs.existsSync(defaultOption.localeFilePath)) {
  throw new Error('locale file is required and must exist');
}

console.log('Start to execute replace text with i18n');
console.log('========================================');

await execute(defaultOption);

console.log('========================================');
console.log('Finish to execute replace text with i18n');