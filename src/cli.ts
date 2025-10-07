import { readStagedDiff, writeCommitMsgFile } from './git';
import { buildPrompt } from './promptTemplates';
import { callLLM } from './llmAdapter';
import fs from 'fs';
import path from 'path';

export async function runCLI(opts: any) {
  const diff = await readStagedDiff();
  if (!diff || diff.trim().length === 0) {
    console.log('No staged diff found. Stage files first (git add).');
    process.exit(0);
  }

  const prompt = buildPrompt(diff);
  console.log('Built prompt (truncated):', prompt.slice(0, 400));

  // call the configured LLM adapter
  const suggestion = await callLLM(prompt);

  console.log('\n--- Suggested commit message ---\n');
  console.log(suggestion);
  console.log('\n-------------------------------\n');

  if (opts.yes) {
    // write directly to COMMIT_EDITMSG and run commit if not in hook
    const commitPath = opts.hook || path.join('.git', 'COMMIT_EDITMSG');
    writeCommitMsgFile(commitPath, suggestion + '\n');
    if (!opts.hook) {
      // spawn git commit
      try {
        require('child_process').execSync(`git commit -F ${commitPath}`, { stdio: 'inherit' });
      } catch (e) {
        console.error('git commit failed:', e);
      }
    }
    return;
  }

  // interactive accept/edit
  const input = await promptYesNo('Accept suggested message? (y = accept / e = edit / n = abort) [y/e/n]: ');
  if (input === 'n') {
    console.log('Aborting.');
    process.exit(1);
  } else if (input === 'y') {
    const commitPath = opts.hook || path.join('.git', 'COMMIT_EDITMSG');
    writeCommitMsgFile(commitPath, suggestion + '\n');
    if (!opts.hook) {
      try { require('child_process').execSync(`git commit -F ${commitPath}`, { stdio: 'inherit' }); } catch(e){ console.error('git commit failed:', e); }
    }
    return;
  } else {
    // edit flow
    console.log('Enter your commit message. End with an empty line.');
    const edited = await readMultilineFromStdin();
    if (!edited.trim()) { console.log('Empty message. Aborting.'); process.exit(1); }
    const commitPath = opts.hook || path.join('.git', 'COMMIT_EDITMSG');
    writeCommitMsgFile(commitPath, edited + '\n');
    if (!opts.hook) {
      try { require('child_process').execSync(`git commit -F ${commitPath}`, { stdio: 'inherit' }); } catch(e){ console.error('git commit failed:', e); }
    }
  }
}

function promptYesNo(question: string) {
  return new Promise<string>((res) => {
    process.stdout.write(question);
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', (d) => res(String(d).trim().toLowerCase()));
  });
}

function readMultilineFromStdin() {
  return new Promise<string>((resolve) => {
    const lines: string[] = [];
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      const s = String(chunk);
      if (s.trim() === '') {
        process.stdin.removeAllListeners('data');
        resolve(lines.join('\n'));
      } else {
        lines.push(s.replace(/\r?\n$/, ''));
      }
    });
    // prompt
    process.stdout.write('> ');
  });
}
