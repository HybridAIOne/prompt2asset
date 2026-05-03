/**
 * Builds markup to embed a sandboxed preview on another page via {@link HTMLIFrameElement.srcdoc}.
 * Escapes {@code &} and {@code "} for safe use in a double-quoted HTML attribute.
 */
export function buildIframeEmbedCode(srcDoc: string): string {
  const escaped = srcDoc.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  return `<iframe
  title="prompt2asset embed"
  sandbox="allow-scripts allow-pointer-lock"
  style="width:100%;min-height:480px;border:0;border-radius:8px;display:block"
  srcdoc="${escaped}"
></iframe>`;
}
