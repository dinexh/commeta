# Commeta

[![npm version](https://badge.fury.io/js/commeta-cli.svg)](https://badge.fury.io/js/commeta-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful CLI tool that generates semantic git commit messages using AI/LLM services like Groq. Automate your commit message writing with intelligent suggestions that follow conventional commit standards.

## Features

- **AI-Powered**: Uses advanced LLM models to analyze your staged changes and generate meaningful commit messages
- **Conventional Commits**: Generates messages following the [Conventional Commits](https://conventionalcommits.org/) specification
- **Multiple LLM Providers**: Currently supports Groq API with easy extensibility for other providers
- **Interactive Mode**: Review and edit suggestions before committing
- **Non-Interactive Mode**: Auto-accept suggestions for CI/CD workflows
- **Git Hook Support**: Can be integrated into git hooks for seamless workflow
- **Configurable**: Flexible configuration through JSON config files
- **Environment Variables**: Secure API key management through .env files

## Installation

### Global Installation (Recommended)

```bash
npm install -g commeta-cli
```

### Local Installation

```bash
npm install commeta-cli
```

### Development Setup

```bash
git clone <repository-url>
cd commeta
npm install
npm run build
```

## Configuration

Create a `.semantic-commitrc.json` file in your project root:

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

### Environment Variables

Create a `.env` file in your project root:

```bash
GROQ_API_KEY=your_groq_api_key_here
```

Get your Groq API key from [Groq Console](https://console.groq.com/).

## Usage

### Basic Usage

```bash
# Generate commit message for staged changes
commeta-cli generate

# Auto-accept suggestion and commit
commeta-cli generate --yes

# Run in non-interactive mode
commeta-cli generate -y
```

### Advanced Usage

```bash
# Get help
commeta-cli --help
commeta-cli generate --help

# Use with git hooks (pass COMMIT_EDITMSG path)
commeta-cli generate --hook .git/COMMIT_EDITMSG
```

### Development Mode

```bash
# Run with ts-node for development
npm run dev -- generate

# Build and run
npm run build
npm start generate
```

## API Reference

### CLI Commands

#### `generate [options]`

Generate a semantic commit message from staged git changes.

**Options:**

- `-y, --yes`: Accept suggestion and commit non-interactively
- `--hook <path>`: Run in hook mode (pass COMMIT_EDITMSG path)
- `-h, --help`: Display help for command

### Configuration Options

#### `.semantic-commitrc.json`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mode` | string | `"interactive"` | CLI interaction mode |
| `llm.adapter` | string | `"groq"` | LLM provider adapter |
| `llm.model` | string | `"llama-3.1-8b-instant"` | Model to use for generation |
| `llm.apiKeyEnv` | string | `"GROQ_API_KEY"` | Environment variable for API key |

### Supported LLM Providers

Currently supported:
- **Groq**: Fast LLM inference with models like Llama 3.1 8B Instant

Extensible architecture allows easy addition of other providers (OpenAI, Anthropic, etc.).

## Examples

### Interactive Mode

```bash
$ commeta-cli generate

feat: add user authentication

Add comprehensive user authentication system including login, registration, and password reset functionality. This includes JWT token generation, password hashing, and secure session management.

Accept? (y = accept / e = edit / n = abort) [y/e/n]:
```

### Non-Interactive Mode

```bash
$ commeta-cli generate --yes
[main abc123] feat: add user authentication
 3 files changed, 156 insertions(+), 23 deletions(-)
```

### Custom Configuration

```bash
# Use different model
echo '{
  "mode": "interactive",
  "llm": {
    "adapter": "groq",
    "model": "llama3-70b-8192",
    "apiKeyEnv": "GROQ_API_KEY"
  }
}' > .semantic-commitrc.json
```

## Supported Models

### Groq Models
- `llama-3.1-8b-instant` (Default - Fast and efficient)
- `llama3-70b-8192` (More capable but slower)
- `mixtral-8x7b-32768` (Mixture of experts model)

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm run dev -- generate

# Or test the built version
npm run build
npm start generate
```

## License

MIT © [Dinesh](https://github.com/yourusername)

## Changelog

### v1.0.0
- Initial release
- Groq API integration
- Interactive and non-interactive modes
- Conventional Commits support
- Comprehensive CLI interface
