import dotenv from 'dotenv';
import { loadConfig } from './config';

// Load environment variables from .env file
dotenv.config();

export async function callLLM(prompt: string): Promise<string> {
  const cfg = loadConfig();

  if (cfg.llm?.adapter === 'groq') {
    const apiKey = process.env[cfg.llm.apiKeyEnv || 'GROQ_API_KEY'];
    if (!apiKey) {
      throw new Error('Missing GROQ_API_KEY');
    }

    const model = cfg.llm.model || 'mixtral-8x7b';
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You are a semantic commit generator following Conventional Commits.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || 'No response';
  }

  // fallback to local command mode
  if (cfg.llm?.localCommand) {
    const { execSync } = await import('child_process');
    return execSync(cfg.llm.localCommand, { input: prompt, encoding: 'utf8' });
  }

  return 'chore: update (no LLM configured)';
}
