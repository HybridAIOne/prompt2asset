import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { buildCompressedAssetShareUrl } from "../lib/assetShareUrl";
import { buildIframeEmbedCode } from "../lib/embedSnippet";
import { type AssetHistoryEntry } from "../lib/assetHistory";
import { AssetHistory } from "./AssetHistory";
import { SandboxArtifactIframe } from "./SandboxArtifactIframe";
import "./PreviewCanvas.css";

type PreviewCanvasProps = {
  srcDoc: string | null;
  busy: boolean;
  error: string | null;
  history: AssetHistoryEntry[];
  onHistorySelect: (entry: AssetHistoryEntry) => void;
};

/**
 * Preview area: chrome + {@link SandboxArtifactIframe} (sandboxed execution).
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#sandbox
 */
export function PreviewCanvas({ srcDoc, busy, error, history, onHistorySelect }: PreviewCanvasProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const embedTitleId = useId();
  const [copyState, setCopyState] = useState<"idle" | "iframe" | "html" | "link" | "error">("idle");
  const [copyError, setCopyError] = useState<string | null>(null);

  const shareUrl = useMemo(() => (srcDoc ? buildCompressedAssetShareUrl(srcDoc) : null), [srcDoc]);

  const openEmbedDialog = useCallback(() => {
    setCopyState("idle");
    setCopyError(null);
    dialogRef.current?.showModal();
  }, []);

  const openShareLink = useCallback(() => {
    if (!shareUrl) return;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }, [shareUrl]);

  const copyShareUrl = useCallback(async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyError(null);
      setCopyState("link");
    } catch {
      setCopyState("error");
      setCopyError("Zwischenablage nicht verfügbar (z. B. unsicheres Kontext oder keine Berechtigung).");
    }
  }, [shareUrl]);

  const closeEmbedDialog = useCallback(() => {
    dialogRef.current?.close();
    setCopyState("idle");
    setCopyError(null);
  }, []);

  const copyIframeSnippet = useCallback(async () => {
    if (!srcDoc) return;
    const code = buildIframeEmbedCode(srcDoc);
    try {
      await navigator.clipboard.writeText(code);
      setCopyError(null);
      setCopyState("iframe");
    } catch {
      setCopyState("error");
      setCopyError("Zwischenablage nicht verfügbar (z. B. unsicheres Kontext oder keine Berechtigung).");
    }
  }, [srcDoc]);

  const copyFullHtml = useCallback(async () => {
    if (!srcDoc) return;
    try {
      await navigator.clipboard.writeText(srcDoc);
      setCopyError(null);
      setCopyState("html");
    } catch {
      setCopyState("error");
      setCopyError("Zwischenablage nicht verfügbar (z. B. unsicheres Kontext oder keine Berechtigung).");
    }
  }, [srcDoc]);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const onClose = () => {
      setCopyState("idle");
      setCopyError(null);
    };
    dlg.addEventListener("close", onClose);
    return () => dlg.removeEventListener("close", onClose);
  }, []);

  const showOverlay = busy || Boolean(error);
  const showEmpty = !busy && !error && srcDoc == null;
  const canShare = Boolean(srcDoc) && !busy && !error;

  return (
    <section className="preview" aria-label="Generierte Vorschau">
      <div className="preview__window">
        <div className="preview__chrome">
          <div className="preview__dots" aria-hidden>
            <span className="preview__dot" />
            <span className="preview__dot" />
            <span className="preview__dot" />
          </div>
          <span className="preview__label">sandbox · srcdoc</span>
        </div>
        <AssetHistory
          entries={history}
          activeSrcDoc={srcDoc}
          onSelect={onHistorySelect}
          disabled={busy}
        />
        <div className="preview__frame-wrap">
          <SandboxArtifactIframe srcDoc={srcDoc} title="LLM Artefakt" className="preview__iframe" />
          {canShare ? (
            <div className="preview__share-anchor">
              <button
                type="button"
                className="preview__share"
                onClick={openEmbedDialog}
                title="Teilen & einbinden"
                aria-label="Teilen & einbinden"
              >
                <svg className="preview__share-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.75" />
                  <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
                  <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.75" />
                  <path
                    d="m8.6 13.5 6.8 4m0-9L8.6 10.5"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          ) : null}
          <div className="preview__overlay" hidden={!showOverlay && !showEmpty}>
            {busy ? (
              <>
                <div className="preview__spinner" aria-hidden />
                <p className="preview__hint">Modell generiert HTML, CSS und JavaScript …</p>
              </>
            ) : null}
            {error ? <p className="preview__error">{error}</p> : null}
            {showEmpty ? (
              <p className="preview__hint">
                Beschreibe oben, was erscheinen soll — zum Beispiel ein kleines Spiel oder eine Demo. Die
                Vorschau lädt danach hier.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="preview__dialog"
        aria-labelledby={embedTitleId}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeEmbedDialog();
        }}
      >
        <div className="preview__dialog-inner" onClick={(e) => e.stopPropagation()}>
          <header className="preview__dialog-head">
            <h2 className="preview__dialog-title" id={embedTitleId}>
              Teilen &amp; einbinden
            </h2>
            <button type="button" className="preview__dialog-close" onClick={closeEmbedDialog} aria-label="Schließen">
              ×
            </button>
          </header>
          <p className="preview__dialog-lead">
            <strong>Direktlink</strong> — öffnet das Artefakt auf dieser Domain in einer Sandbox (LZ-Kompression im
            Hash). Zum Teilen in Chat oder E-Mail; sehr große Seiten überschreiten manchmal URL-Limits — dann Iframe oder
            HTML kopieren.
          </p>
          {shareUrl ? (
            <div className="preview__dialog-link-block">
              <input className="preview__dialog-url" readOnly value={shareUrl} aria-label="Share-URL" />
              <div className="preview__dialog-actions preview__dialog-actions--narrow">
                <button type="button" className="preview__dialog-btn preview__dialog-btn--primary" onClick={copyShareUrl}>
                  Link kopieren
                </button>
                <button type="button" className="preview__dialog-btn" onClick={openShareLink}>
                  Link öffnen
                </button>
              </div>
            </div>
          ) : (
            <p className="preview__dialog-muted">
              Für dieses Artefakt ist kein Direktlink möglich (nach Kompression noch zu lang). Nutze unten Iframe-Code oder
              HTML-Datei.
            </p>
          )}

          <p className="preview__dialog-lead preview__dialog-lead--spaced">
            <strong>Einbinden</strong> — Iframe mit derselben Sandbox wie hier (
            <code>sandbox=&quot;allow-scripts allow-pointer-lock&quot;</code>
            ). Ohne Hosting, solange der Snippet in die Seite passt.
          </p>
          <div className="preview__dialog-actions">
            <button type="button" className="preview__dialog-btn preview__dialog-btn--primary" onClick={copyIframeSnippet}>
              Iframe-Code kopieren
            </button>
            <button type="button" className="preview__dialog-btn" onClick={copyFullHtml}>
              Nur HTML-Seite kopieren
            </button>
          </div>
          {copyState !== "idle" ? (
            <p
              className={copyState === "error" ? "preview__dialog-feedback preview__dialog-feedback--error" : "preview__dialog-feedback"}
              role="status"
            >
              {copyState === "error"
                ? copyError
                : copyState === "iframe"
                  ? "Iframe-Snippet wurde in die Zwischenablage kopiert."
                  : copyState === "link"
                    ? "Share-Link wurde in die Zwischenablage kopiert."
                    : "Vollständiges HTML wurde kopiert — z. B. als index.html bereitstellen."}
            </p>
          ) : null}
          <footer className="preview__dialog-foot">
            <button type="button" className="preview__dialog-btn-text" onClick={closeEmbedDialog}>
              Schließen
            </button>
          </footer>
        </div>
      </dialog>
    </section>
  );
}
