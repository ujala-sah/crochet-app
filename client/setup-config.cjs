// Fills in .env by prompting for each key .env.example lists. Safe to re-run:
// any key already in .env becomes that prompt's default, so pressing Enter for
// everything just rewrites what's already there, and changing one value doesn't
// mean retyping the rest.
//
// Run with: node setup-env.js

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const examplePath = path.join(__dirname, ".env.example");
const envPath = path.join(__dirname, ".env");

if (!fs.existsSync(examplePath)) {
  console.error(".env.example not found next to this script.");
  process.exit(1);
}

// Only KEY=value lines matter here. Comments in .env.example are written for a
// person reading the file, not part of what actually gets asked for.
function parseEnv(text) {
  const values = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    values[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return values;
}

const exampleValues = parseEnv(fs.readFileSync(examplePath, "utf8"));
const currentValues = fs.existsSync(envPath)
  ? parseEnv(fs.readFileSync(envPath, "utf8"))
  : {};

// A value like <user> or <a long random string> is a placeholder meant to be
// replaced, not something to run with — so it's shown as a hint but never handed
// back as the default. Anything else in .env.example (a real port number, a real
// local URL) is safe to reuse as-is, the same as a value already sitting in .env.
function isPlaceholder(value) {
  return /<.*>/.test(value);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  console.log(`Setting up ${envPath}\n`);

  const keys = Object.keys(exampleValues);
  const result = {};

  for (const key of keys) {
    // A real value in .env is always the default. With no .env yet, fall back to
    // .env.example's own value — but only when it isn't a placeholder; a
    // placeholder is shown as a hint instead, so Enter can't write it in verbatim.
    const existing = currentValues[key];
    const example = exampleValues[key];
    const fallback =
      existing !== undefined
        ? existing
        : isPlaceholder(example)
          ? undefined
          : example;

    const prompt = fallback
      ? `${key} [${fallback}]: `
      : `${key} (e.g. ${example}): `;

    const answer = (await ask(prompt)).trim();
    result[key] = answer || fallback || "";
  }

  rl.close();

  const lines = keys.map((key) => `${key}=${result[key]}`);
  fs.writeFileSync(envPath, lines.join("\n") + "\n");

  console.log(`\nWrote ${keys.length} values to ${envPath}`);

  const blanks = keys.filter((key) => !result[key]);
  if (blanks.length > 0) {
    console.log(
      `Left blank — edit .env by hand before starting the app: ${blanks.join(", ")}`,
    );
  }
}

main();
