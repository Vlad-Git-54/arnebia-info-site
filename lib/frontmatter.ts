import type { ParsedFrontmatter } from "@/types/content";

const frontmatterPattern = /^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/;

function parseScalar(value: string) {
  const trimmed = value.trim();

  if (!trimmed) return "";
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);

  if (
    (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
    (trimmed.startsWith("{") && trimmed.endsWith("}"))
  ) {
    return JSON.parse(trimmed);
  }

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

export function parseFrontmatter<T extends Record<string, unknown>>(
  source: string,
): ParsedFrontmatter<T> {
  const match = source.match(frontmatterPattern);

  if (!match) {
    throw new Error("MDX content must start with frontmatter.");
  }

  const [, rawFrontmatter, body] = match;
  const data: Record<string, unknown> = {};

  for (const line of rawFrontmatter.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf(":");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const rawValue = trimmed.slice(separator + 1);
    data[key] = parseScalar(rawValue);
  }

  return {
    ...(data as T),
    body: body.trim(),
  };
}

