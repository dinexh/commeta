#!/usr/bin/env node

import { program } from 'commander';
import { runCLI } from './cli';

program
  .name('commeta')
  .description('Generate semantic commit messages locally with free LLMs')
  .version('0.1.0');

program
  .command('generate')
  .description('Generate commit message from staged diff')
  .option('-y, --yes', 'Accept suggestion and commit non-interactively')
  .option('--hook <path>', 'Run in hook mode (pass COMMIT_EDITMSG path)')
  .action(async (opts) => {
    await runCLI(opts);
  });

program.parse(process.argv);
