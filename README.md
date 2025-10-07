# commeta (prototype)

Local CLI to generate semantic git commit messages using free/local LLMs.

## Quickstart
1. Install deps:

```bash
npm install
```

2. Run in dev (uses ts-node):

```bash
npm run dev -- generate
```

3. Configure `.semantic-commitrc.json` to point at your local LLM runtime (e.g. Ollama):

```json
{
  "llm": { "localCommand": "ollama run mistral --stdin" }
}
```

## Notes
- This is a skeleton starter. Next: implement secret-scrubber, caching, hook wiring, and candidate messages.
- If you prefer another language (Go/Rust), we can scaffold that instead.
git cli too that helps with commits
