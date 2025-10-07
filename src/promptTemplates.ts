export function buildPrompt(diff: string): string {
  const prompt = `You are a professional software engineer specializing in generating precise and meaningful git commit messages.\n\nObjective:\nBased on the given staged diff, generate a single semantic git commit message following the Conventional Commits format.\n\nReturn only the commit message with structure:\n<type>(<optional-scope>): <short summary (<=72 chars)>\n\n<detailed body explaining WHAT changed and WHY>\n\n<footer optional>\n\nDIFF START\n${diff}\nDIFF END`;
  return prompt;
}
