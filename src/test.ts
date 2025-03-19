import { program } from 'commander';
program
  .name('string-util')
  .description('CLI to some JavaScript string utilities')
  .version('0.8.0')
  .option('--file <path>', 'Process a single Vue file', '124')
  .option('-s, --separator <char>', 'separator', '124')

program.parse();

const options = program.opts();

console.log(options);