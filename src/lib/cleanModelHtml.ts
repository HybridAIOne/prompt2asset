/**
 * Entfernt übliche Markdown-Umhüllung (```html … ```) und Text vor dem HTML-Dokument.
 */
export function cleanModelHtml(raw: string): string {
  let s = raw.trim();

  if (s.startsWith("```")) {
    const lines = s.split(/\r?\n/);
    if (lines.length && lines[0].startsWith("```")) lines.shift();
    if (lines.length && lines[lines.length - 1].trim() === "```") lines.pop();
    s = lines.join("\n").trim();
    if (/^html\s*\r?\n?/i.test(s)) s = s.replace(/^html\s*\r?\n?/i, "");
  }

  const start = s.search(/<!DOCTYPE|<html[\s>]/i);
  if (start > 0) s = s.slice(start);
  return s.trim();
}

/**
 * Liefert ein für {@link HTMLIFrameElement.srcdoc} taugliches HTML-Dokument.
 */
export function normalizeHtmlDocument(raw: string): string {
  let html = cleanModelHtml(raw);

  const hasDoc =
    /^<!DOCTYPE/i.test(html) || /^<html[\s>]/i.test(html.trimStart());
  if (!hasDoc) {
    html =
      `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>\n` +
      html +
      `\n</body></html>`;
  }

  return html;
}
