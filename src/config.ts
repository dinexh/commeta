import fs from 'fs';
import path from 'path';

const DEFAULT = {
  mode: 'interactive',
  llm: { adapter: 'groq', model: 'llama-3.1-8b-instant', apiKeyEnv: 'GROQ_API_KEY' }
};

export function loadConfig() {
  try {
    const p = path.join(process.cwd(), '.semantic-commitrc.json');
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    }
  } catch (e) {
    // ignore
  }
  return DEFAULT;
}
