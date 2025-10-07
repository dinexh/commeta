# commeta (prototype)

Local CLI to generate semantic git commit messages using LLMs like Groq.

## Quickstart
1. Install deps:

```bash
npm install
```

2. Run in dev (uses ts-node):

```bash
npm run dev -- generate
```

3. Configure `.semantic-commitrc.json` for your LLM provider (Groq example):

```json
{
  "mode": "interactive",
  "llm": {
    "adapter": "groq",
    "model": "llama-3.1-8b-instant",
    "apiKeyEnv": "GROQ_API_KEY"
  }
}
```

4. Create a `.env` file in your project root:

```bash
GROQ_API_KEY=your_groq_api_key_here
```

## Usage

```bash
# Interactive mode (default)
npm run dev generate

# Non-interactive mode (auto-accept)
npm run dev generate -- --yes

# With built version
npm start generate
```

## Notes
- This is a skeleton starter. Next: implement secret-scrubber, caching, hook wiring, and candidate messages.
- Currently supports Groq API. Can be extended for other LLM providers.
- Uses Conventional Commits format for generated messages.
