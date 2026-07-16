/**
 * Converts accidental Markdown from the model into terminal-friendly plain text.
 * Kept pure so it is safe to call for every partial streaming update.
 */
export function normalizeTerminalText(value: string): string {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, "$1 ($2)")
    .replace(/\*\*|__/g, "")
    .replace(/`+/g, "")
    .replace(/(^|[\s([{])\*([^*\n]+)\*(?=$|[\s.,;:!?)}\]])/g, "$1$2")
    .replace(/(^|[\s([{])_([^_\n]+)_(?=$|[\s.,;:!?)}\]])/g, "$1$2")
    .replace(/\n[ \t]*\n(?:[ \t]*\n)+/g, "\n\n")
    // Streaming models can rarely repeat the same completed sentence verbatim.
    // Collapse only exact, adjacent sentences long enough to avoid altering prose.
    .replace(/([^.!?\n]{10,}[.!?])\s*\1/g, "$1");
}

/**
 * Renders text with clickable URLs as React elements.
 * Splits text by URL pattern and returns an array of strings and link objects.
 */
export function parseTerminalLinks(text: string): Array<{ text: string; href?: string }> {
  const URL_REGEX = /(https?:\/\/[^\s,;)\]>]+|linkedin\.com\/[^\s,;)\]>]+|credly\.com\/[^\s,;)\]>]+|instagram\.com\/[^\s,;)\]>]+)/g;
  const parts: Array<{ text: string; href?: string }> = [];
  let lastIndex = 0;

  for (const match of text.matchAll(URL_REGEX)) {
    const start = match.index!;
    if (start > lastIndex) {
      parts.push({ text: text.slice(lastIndex, start) });
    }
    const url = match[0];
    // Add https:// if missing
    const href = url.startsWith("http") ? url : `https://${url}`;
    parts.push({ text: url, href });
    lastIndex = start + url.length;
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ text }];
}

/** Commands owned by the terminal UI must never be sent to the AI provider. */
export function isTerminalClearCommand(value: string): boolean {
  // Strip optional terminal prompt prefix ($ or >) and surrounding whitespace
  const cleaned = value.replace(/^[\s$>]+/, "").trim();
  return /^(?:clear|cls|limpiar)$/i.test(cleaned);
}
