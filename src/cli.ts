import { readStagedDiff, writeCommitMsgFile } from './git';
import { buildPrompt } from './promptTemplates';
import { callLLM } from './llmAdapter';
import fs from 'fs';
import path from 'path';

export async function runCLI(opts: any) {
  const diff = await readStagedDiff();
  if (!diff || diff.trim().length === 0) {
    console.log('No staged diff found. Stage files first (git add).');
    return;
  }

  const prompt = buildPrompt(diff);

  // call the configured LLM adapter
  const suggestion = await callLLM(prompt);

  console.log(suggestion);

  if (opts.yes) {
    // write directly to COMMIT_EDITMSG and run commit if not in hook
    const commitPath = opts.hook || path.join('.git', 'COMMIT_EDITMSG');
    writeCommitMsgFile(commitPath, suggestion + '\n');
    if (!opts.hook) {
      // spawn git commit
      try {
        require('child_process').execSync(`git commit -F ${commitPath}`, { stdio: 'inherit' });
        process.exit(0);
      } catch (e) {
        console.error('git commit failed:', e);
        process.exit(1);
      }
    }
    return;
  }

  // interactive accept/edit
  const input = await promptYesNo('Accept? (y = accept / e = edit / n = abort) [y/e/n]: ');
  if (input === 'n') {
    console.log('Aborting.');
    process.exit(1);
  } else if (input === 'y') {
    const commitPath = opts.hook || path.join('.git', 'COMMIT_EDITMSG');
    writeCommitMsgFile(commitPath, suggestion + '\n');
    if (!opts.hook) {
      try {
        require('child_process').execSync(`git commit -F ${commitPath}`, { stdio: 'inherit' });
        process.exit(0);
      } catch(e){
        console.error('git commit failed:', e);
        process.exit(1);
      }
    }
    return;
  } else {
    // edit flow
    console.log('Enter your commit message (end with empty line):');
    const edited = await readMultilineFromStdin();
    if (!edited.trim()) { console.log('Empty message. Aborting.'); process.exit(1); }
    const commitPath = opts.hook || path.join('.git', 'COMMIT_EDITMSG');
    writeCommitMsgFile(commitPath, edited + '\n');
    if (!opts.hook) {
      try {
        require('child_process').execSync(`git commit -F ${commitPath}`, { stdio: 'inherit' });
        process.exit(0);
      } catch(e){
        console.error('git commit failed:', e);
        process.exit(1);
      }
    }
    return;
  }
}

function promptYesNo(question: string) {
  return new Promise<string>((resolve) => {
    process.stdout.write(question);
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', (d) => {
      const input = String(d).trim().toLowerCase();
      resolve(input);
    });
    process.stdin.once('end', () => resolve('n')); // Default to abort on EOF
  });
}

function readMultilineFromStdin() {
  return new Promise<string>((resolve) => {
    const lines: string[] = [];
    process.stdin.setEncoding('utf8');
    let isFirstChunk = true;

    process.stdin.on('data', (chunk) => {
      const s = String(chunk);

      // Handle the first chunk (initial prompt response)
      if (isFirstChunk) {
        isFirstChunk = false;
        // If user just presses enter immediately, treat as empty
        if (s.trim() === '' || s === '\n' || s === '\r\n') {
          process.stdin.removeAllListeners('data');
          resolve('');
          return;
        }
      }

      // Check for empty line (user pressed enter on a line with no text)
      if (s.trim() === '' || s === '\n' || s === '\r\n') {
        process.stdin.removeAllListeners('data');
        resolve(lines.join('\n'));
      } else {
        lines.push(s.replace(/\r?\n$/, ''));
      }
    });

    process.stdout.write('> ');
  });
}
