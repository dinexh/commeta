import { execSync } from 'child_process';
import fs from 'fs';

export function readStagedDiff(): string {
  try {
    const diff = execSync('git diff --staged --unified=0 --no-color', { encoding: 'utf8' });
    if (!diff.trim()) {
      // fallback to file list
      const names = execSync('git diff --staged --name-only', { encoding: 'utf8' }).trim();
      return names ? `STAGED FILES:\n${names}` : '';
    }
    return diff;
  } catch (e) {
    return '';
  }
}

export function writeCommitMsgFile(path: string, content: string) {
  fs.writeFileSync(path, content, { encoding: 'utf8' });
}
