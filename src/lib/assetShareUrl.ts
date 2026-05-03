import LZString from "lz-string";

/** Konservatives Limit — einige Messenger kürzen früher; große Assets brauchen Iframe/HTML-Download. */
const MAX_SHARE_URL_LENGTH = 750_000;

/**
 * Direktlink zu {@link /public/asset-viewer.html}: HTML wird LZ-komprimiert im Hash untergebracht.
 * @returns `null`, wenn die URL zu lang wäre.
 */
export function buildCompressedAssetShareUrl(fullHtml: string): string | null {
  const compressed = LZString.compressToEncodedURIComponent(fullHtml);
  const base = import.meta.env.BASE_URL;
  const normalized = base.endsWith("/") ? base : `${base}/`;
  const viewerUrl = new URL(`${normalized}asset-viewer.html`, window.location.origin);
  viewerUrl.hash = `d=${compressed}`;
  const href = viewerUrl.toString();
  if (href.length > MAX_SHARE_URL_LENGTH) return null;
  return href;
}
