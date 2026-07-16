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
