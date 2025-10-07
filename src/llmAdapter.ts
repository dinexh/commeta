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

    try {
      console.log(`Making request to Groq API with model: ${model}`);
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
          max_tokens: 200,
        }),
      });

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Groq API error: ${response.status} - ${errorText}`);
        return `feat: fix api error\n\nGroq API returned error: ${response.status}\n${errorText}`;
      }

      const data = await response.json();
      console.log(`Response data keys: ${Object.keys(data)}`);

      if (data.error) {
        console.error(`Groq API error in response: ${JSON.stringify(data.error)}`);
        return `feat: fix api error\n\nAPI Error: ${data.error.message}`;
      }

      return data.choices?.[0]?.message?.content?.trim() || 'No response from API';
    } catch (error: any) {
      console.error(`Error calling Groq API: ${error.message}`);
      return `feat: fix api error\n\nError calling Groq API: ${error.message}`;
    }
  }

  // fallback to local command mode
  if (cfg.llm?.localCommand) {
    const { execSync } = await import('child_process');
    try {
      return execSync(cfg.llm.localCommand, { input: prompt, encoding: 'utf8' });
    } catch (error: any) {
      return `feat: fix local command error\n\nError running local command: ${error.message}`;
    }
  }

  return 'chore: update (no LLM configured)';
}
